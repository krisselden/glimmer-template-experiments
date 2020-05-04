import type { ASTPluginBuilder } from '@glimmer/syntax';
import fs from 'fs';
import path from 'path';
import util from 'util';
import yargs from 'yargs';

import compile from './compile.js';
import countOps from './count-ops.js';
import findTemplates from './find-templates.js';
import formatDebug from './format-debug.js';
import newOpCounts from './new-op-counts.js';
import opName from './op-name.js';

yargs
  .command(
    'format <file>',
    'print template file',
    (yargs) => {
      yargs.positional('file', {
        describe: 'glimmer template file',
        type: 'string',
      });
      yargs.boolean('ember-default-plugins');
    },
    // yargs does support promise return here
    // this is bad typings from @types/yargs
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (argv) => {
      const file = argv.file as string;
      const source = fs.readFileSync(file, 'utf8');
      const block = compile(
        source,
        moduleNameFor(file),
        await pluginsFor(argv)
      );
      console.log(
        argv.file,
        util.inspect(block, { colors: true, depth: Infinity })
      );
      console.log(
        util.inspect(formatDebug(block), { colors: true, depth: Infinity })
      );
    }
  )
  .command(
    'stats directory',
    'print template stats',
    (yargs) => {
      yargs.positional('directory', {
        describe: 'template directory',
      });
      yargs.boolean('ember-default-plugins');
    },
    // yargs does support promise return here
    // this is bad typings from @types/yargs
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (argv) => {
      const directory = argv.directory as string;
      const files = findTemplates(directory);
      console.info('found %o templates in %o', files.length, argv.directory);
      const plugins = await pluginsFor(argv);
      const counts = newOpCounts();
      for (const file of files) {
        const source = fs.readFileSync(path.join(directory, file), 'utf8');
        const moduleName = moduleNameFor(file);
        const block = compile(source, moduleName, plugins);
        countOps(block, counts);
      }

      let total = 0;
      const namedCounts = Object.entries(counts).map(([op, count]) => {
        const name = opName(op);
        total += count;
        return { name, count };
      });
      namedCounts.sort((a, b) => b.count - a.count);

      console.table(
        namedCounts.map(({ name, count }) => ({
          name,
          count,
          percent: Math.round((count / total) * 100),
        }))
      );
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  }).argv;

function moduleNameFor(file: string): string {
  let name = file;
  const period = file.lastIndexOf('.');
  if (period !== -1) {
    name = name.slice(0, period);
  }
  const parts = name.split(/\/(?:app|addon)\//);
  return parts[parts.length - 1];
}

async function pluginsFor(args: {
  [name: string]: unknown;
}): Promise<ASTPluginBuilder[] | undefined> {
  if (args['use-default-plugins']) {
    const compiler = await import(
      'ember-source/dist/ember-template-compiler.js'
    );
    return compiler.defaultPlugins;
  }
}
