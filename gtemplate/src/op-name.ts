import { SexpOpcodes } from '@glimmer/interfaces';

import type { Op, OpName, OpNames } from './types';

const OP_NAME: OpNames = {
  [SexpOpcodes.Append]: 'AppendStatement',
  [SexpOpcodes.TrustingAppend]: 'TrustingAppendStatement',
  [SexpOpcodes.Comment]: 'CommentStatement',
  [SexpOpcodes.Modifier]: 'ModifierStatement',
  [SexpOpcodes.Block]: 'BlockStatement',
  [SexpOpcodes.Component]: 'ComponentStatement',

  [SexpOpcodes.OpenElement]: 'OpenElementStatement',
  [SexpOpcodes.OpenElementWithSplat]: 'OpenElementWithSplatStatement',
  [SexpOpcodes.FlushElement]: 'FlushElementStatement',
  [SexpOpcodes.CloseElement]: 'CloseElementStatement',
  [SexpOpcodes.StaticAttr]: 'StaticAttrStatement',
  [SexpOpcodes.DynamicAttr]: 'DynamicAttrStatement',
  [SexpOpcodes.ComponentAttr]: 'ComponentAttrStatement',

  [SexpOpcodes.AttrSplat]: 'AttrSplatStatement',
  [SexpOpcodes.Yield]: 'YieldStatement',
  [SexpOpcodes.Partial]: 'PartialStatement',

  [SexpOpcodes.DynamicArg]: 'DynamicArgStatement',
  [SexpOpcodes.StaticArg]: 'StaticArgStatement',
  [SexpOpcodes.TrustingDynamicAttr]: 'TrustingDynamicAttrStatement',
  [SexpOpcodes.TrustingComponentAttr]: 'TrustingComponentAttrStatement',
  [SexpOpcodes.StaticComponentAttr]: 'StaticComponentAttrStatement',

  [SexpOpcodes.Debugger]: 'DebuggerStatement',

  [SexpOpcodes.HasBlock]: 'HasBlockExpression',
  [SexpOpcodes.HasBlockParams]: 'HasBlockParamsExpression',
  [SexpOpcodes.Undefined]: 'UndefinedExpression',
  [SexpOpcodes.Call]: 'CallExpression',
  [SexpOpcodes.Concat]: 'ConcatExpression',
  [SexpOpcodes.GetSymbol]: 'GetSymbolExpression',
  [SexpOpcodes.GetFree]: 'GetFreeExpression',
  [SexpOpcodes.GetFreeInAppendSingleId]: 'GetFreeInAppendSingleIdExpression',
  [SexpOpcodes.GetFreeInExpression]: 'GetFreeInExpressionExpression',
  [SexpOpcodes.GetFreeInCallHead]: 'GetFreeInCallHeadExpression',
  [SexpOpcodes.GetFreeInBlockHead]: 'GetFreeInBlockHeadExpression',
  [SexpOpcodes.GetFreeInModifierHead]: 'GetFreeInModifierHeadExpression',
  [SexpOpcodes.GetFreeInComponentHead]: 'GetFreeInComponentHeadExpression',
};

function opName(op: Op): OpName;
function opName(op: string | number): OpName | undefined;
function opName(op: string | number): OpName | undefined {
  if (isOp(op)) {
    return OP_NAME[op];
  }
}

export default opName;

function isOp(op: string | number): op is Op {
  return op in OP_NAME;
}
