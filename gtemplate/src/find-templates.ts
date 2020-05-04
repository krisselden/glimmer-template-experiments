import walkSync from 'walk-sync';

const DEFAULT_GLOB = ['**/*.hbs'];
const DEFAULT_IGNORE = [
  '**/node_modules',
  '.git',
  'tmp',
  'dist',
  'config',
  'build',
];

export default function findTemplates(
  directory: string,
  globs = DEFAULT_GLOB,
  ignore = DEFAULT_IGNORE
): string[] {
  return walkSync(directory, {
    globs,
    ignore,
    directories: false,
  });
}
