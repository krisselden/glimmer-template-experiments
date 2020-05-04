import compiler from '@glimmer/compiler';
import type { SerializedTemplateBlock } from '@glimmer/interfaces';
import type {
  AST,
  ASTPlugin,
  ASTPluginBuilder,
  ASTPluginEnvironment,
} from '@glimmer/syntax';
import syntax from '@glimmer/syntax';

const { TemplateCompiler } = compiler;

export default function compile(
  source: string,
  moduleName: string,
  plugins: ASTPluginBuilder[] = [transformDotComponentInvocation]
): SerializedTemplateBlock {
  const ast = syntax.preprocess(source, {
    meta: {
      moduleName,
    },
    plugins: {
      ast: plugins,
    },
  });
  const { block } = TemplateCompiler.compile(ast, source);
  return block.toJSON();
}

function transformDotComponentInvocation(env: ASTPluginEnvironment): ASTPlugin {
  const builders = env.syntax.builders;

  function isMultipartPath(path: AST.Expression): path is AST.PathExpression {
    return 'parts' in path && path.parts.length > 1;
  }

  function isInlineInvocation(
    path: AST.Expression,
    params: AST.Expression[],
    hash: AST.Hash
  ): boolean {
    if (isMultipartPath(path)) {
      if (params.length > 0 || hash.pairs.length > 0) {
        return true;
      }
    }

    return false;
  }

  function wrapInComponent(
    node: AST.BlockStatement | AST.MustacheStatement
  ): void {
    const component = node.path;
    const componentHelper = builders.path('component');
    node.path = componentHelper;
    node.params.unshift(component);
  }

  return {
    name: 'transform-dot-component-invocation',

    visitor: {
      MustacheStatement: (node) => {
        if (isInlineInvocation(node.path, node.params, node.hash)) {
          wrapInComponent(node);
        }
      },
      BlockStatement: (node) => {
        if (isMultipartPath(node.path)) {
          wrapInComponent(node);
        }
      },
    },
  };
}
