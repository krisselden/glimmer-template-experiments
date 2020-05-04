import { SexpOpcodes, Statement, TupleExpression } from '@glimmer/interfaces';

export default function newOpCounts(): OpCounts {
  return {
    [SexpOpcodes.Append]: 0,
    [SexpOpcodes.AttrSplat]: 0,
    [SexpOpcodes.Block]: 0,
    [SexpOpcodes.Call]: 0,
    [SexpOpcodes.CloseElement]: 0,
    [SexpOpcodes.Comment]: 0,
    [SexpOpcodes.Component]: 0,
    [SexpOpcodes.ComponentAttr]: 0,
    [SexpOpcodes.Concat]: 0,
    [SexpOpcodes.Debugger]: 0,
    [SexpOpcodes.DynamicArg]: 0,
    [SexpOpcodes.DynamicAttr]: 0,
    [SexpOpcodes.FlushElement]: 0,
    [SexpOpcodes.GetFree]: 0,
    [SexpOpcodes.GetFreeInAppendSingleId]: 0,
    [SexpOpcodes.GetFreeInBlockHead]: 0,
    [SexpOpcodes.GetFreeInCallHead]: 0,
    [SexpOpcodes.GetFreeInComponentHead]: 0,
    [SexpOpcodes.GetFreeInExpression]: 0,
    [SexpOpcodes.GetFreeInModifierHead]: 0,
    [SexpOpcodes.GetSymbol]: 0,
    [SexpOpcodes.HasBlock]: 0,
    [SexpOpcodes.HasBlockParams]: 0,
    [SexpOpcodes.Modifier]: 0,
    [SexpOpcodes.OpenElement]: 0,
    [SexpOpcodes.OpenElementWithSplat]: 0,
    [SexpOpcodes.Partial]: 0,
    [SexpOpcodes.StaticArg]: 0,
    [SexpOpcodes.StaticAttr]: 0,
    [SexpOpcodes.StaticComponentAttr]: 0,
    [SexpOpcodes.TrustingAppend]: 0,
    [SexpOpcodes.TrustingComponentAttr]: 0,
    [SexpOpcodes.TrustingDynamicAttr]: 0,
    [SexpOpcodes.TrustingDynamicAttr]: 0,
    [SexpOpcodes.Undefined]: 0,
    [SexpOpcodes.Yield]: 0,
  };
}

export type OpCounts = {
  [TOp in Statement[0] | TupleExpression[0]]: number;
};
