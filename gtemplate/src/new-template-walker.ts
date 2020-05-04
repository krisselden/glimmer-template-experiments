import type {
  Expression,
  Statement,
  TupleExpression,
} from '@glimmer/interfaces';

import opName from './op-name.js';
import type {
  TemplateVisitor,
  TemplateWalker,
  Visit,
  VisitorArg,
} from './types';

export default function newTemplateWalker(
  visitor: Partial<TemplateVisitor>
): TemplateWalker {
  const walker: TemplateWalker = {
    TemplateBlock: walk(visitor.TemplateBlock, (block) => walker.Block(block)),
    InlineBlock: walk(visitor.InlineBlock, (block) => walker.Block(block)),
    Block: walk(visitor.Block, (block) =>
      block.statements.forEach(walker.Statement)
    ),

    Statement: walk(visitor.Statement, walkOp),

    Expression: walk(visitor.Expression, (expression) => {
      if (Array.isArray(expression)) {
        walker.TupleExpression(expression);
      } else {
        walker.ValueExpression(expression);
      }
    }),
    TupleExpression: walk(visitor.TupleExpression, walkOp),
    ValueExpression: walk(visitor.ValueExpression),

    Params: walk(visitor.Params, (params) => params?.forEach(walker.Param)),
    Param: walk(visitor.Param, (param) => walker.Expression(param)),

    Hash: walk(visitor.Hash, (hash) => walkNamed(hash, walker.HashEntry)),
    HashEntry: walk(visitor.HashEntry, ([, value]) => walker.Expression(value)),

    Attributes: walk(visitor.Attributes, (attributes) =>
      attributes.forEach(walker.Attribute)
    ),
    Attribute: walk(visitor.Attribute, (attribute) =>
      walker.Statement(attribute)
    ),

    Blocks: walk(visitor.Blocks, (blocks) =>
      walkNamed(blocks, walker.NamedBlock)
    ),
    NamedBlock: walk(visitor.NamedBlock, ([, value]) =>
      walker.InlineBlock(value)
    ),

    AppendStatement: walk(visitor.AppendStatement, walkRef),
    TrustingAppendStatement: walk(visitor.TrustingAppendStatement, walkRef),

    CommentStatement: walk(visitor.CommentStatement),

    ModifierStatement: walk(
      visitor.ModifierStatement,
      ([, ref, params, hash]) => {
        walker.Expression(ref);
        walker.Params(params);
        walker.Hash(hash);
      }
    ),
    BlockStatement: walk(
      visitor.BlockStatement,
      ([, ref, params, hash, blocks]) => {
        walker.Expression(ref);
        walker.Params(params);
        walker.Hash(hash);
        walker.Blocks(blocks);
      }
    ),
    ComponentStatement: walk(
      visitor.ComponentStatement,
      ([, ref, attrs, hash, blocks]) => {
        walker.Expression(ref);
        walker.Attributes(attrs);
        walker.Hash(hash);
        walker.Blocks(blocks);
      }
    ),

    OpenElementStatement: walk(visitor.OpenElementStatement),
    OpenElementWithSplatStatement: walk(visitor.OpenElementWithSplatStatement),
    FlushElementStatement: walk(visitor.FlushElementStatement),
    CloseElementStatement: walk(visitor.CloseElementStatement),
    StaticAttrStatement: walk(visitor.StaticAttrStatement),

    DynamicAttrStatement: walk(visitor.DynamicAttrStatement, walkValue),
    ComponentAttrStatement: walk(visitor.ComponentAttrStatement, walkValue),

    AttrSplatStatement: walk(visitor.AttrSplatStatement),
    YieldStatement: walk(visitor.YieldStatement, ([, , params]) =>
      walker.Params(params)
    ),
    PartialStatement: walk(visitor.PartialStatement, walkRef),

    DynamicArgStatement: walk(visitor.DynamicArgStatement, walkValue),
    StaticArgStatement: walk(visitor.StaticArgStatement, walkValue),
    TrustingDynamicAttrStatement: walk(
      visitor.TrustingDynamicAttrStatement,
      walkValue
    ),
    TrustingComponentAttrStatement: walk(
      visitor.TrustingComponentAttrStatement,
      walkValue
    ),
    StaticComponentAttrStatement: walk(
      visitor.StaticComponentAttrStatement,
      walkValue
    ),

    DebuggerStatement: walk(visitor.DebuggerStatement),

    HasBlockExpression: walk(visitor.HasBlockExpression, walkRef),
    HasBlockParamsExpression: walk(visitor.HasBlockParamsExpression, walkRef),
    UndefinedExpression: walk(visitor.UndefinedExpression),
    CallExpression: walk(visitor.CallExpression, ([, ref, params, hash]) => {
      walker.Expression(ref);
      walker.Params(params);
      walker.Hash(hash);
    }),
    ConcatExpression: walk(visitor.ConcatExpression, ([, params]) =>
      walker.Params(params)
    ),
    GetSymbolExpression: walk(visitor.GetSymbolExpression),
    GetFreeExpression: walk(visitor.GetFreeExpression),
    GetFreeInAppendSingleIdExpression: walk(
      visitor.GetFreeInAppendSingleIdExpression
    ),
    GetFreeInExpressionExpression: walk(visitor.GetFreeInExpressionExpression),
    GetFreeInCallHeadExpression: walk(visitor.GetFreeInCallHeadExpression),
    GetFreeInBlockHeadExpression: walk(visitor.GetFreeInBlockHeadExpression),
    GetFreeInModifierHeadExpression: walk(
      visitor.GetFreeInModifierHeadExpression
    ),
    GetFreeInComponentHeadExpression: walk(
      visitor.GetFreeInComponentHeadExpression
    ),
  };

  return walker;

  function walkValue<
    TSexp extends {
      2: Expression;
    } & Array<unknown>
  >([, , value]: TSexp): void {
    return walker.Expression(value);
  }

  function walkRef<
    TSexp extends {
      1: Expression;
    } & Array<unknown>
  >([, ref]: TSexp): void {
    return walker.Expression(ref);
  }

  function walkOp(sexp: Statement | TupleExpression): void {
    const name = opName(sexp[0]);
    const walk = walker[name] as (sexp: Statement | TupleExpression) => void;
    walk(sexp);
  }
}

function walkNamed<TValue>(
  entries: [string[], TValue[]] | null,
  descend: (entry: [string, TValue]) => void
): void {
  if (entries === null) return;
  const [names, values] = entries;
  for (let i = 0; i < names.length; i++) {
    descend([names[i], values[i]]);
  }
}

function walk<TArg extends VisitorArg>(
  visit: Visit<TArg> | undefined,
  descend?: (arg: TArg) => void
): (arg: TArg) => void {
  return (arg) => {
    enter(visit, arg);
    if (descend !== undefined) descend(arg);
    exit(visit, arg);
  };
}

function enter<TArg extends VisitorArg>(
  visit: Visit<TArg> | undefined,
  arg: TArg
): void {
  if (visit !== undefined) {
    if (typeof visit === 'function') {
      visit(arg);
    } else {
      visit.enter(arg);
    }
  }
}

function exit<TArg extends VisitorArg>(
  visit: Visit<TArg> | undefined,
  arg: TArg
): void {
  if (visit !== undefined) {
    if (typeof visit !== 'function') {
      visit.exit(arg);
    }
  }
}
