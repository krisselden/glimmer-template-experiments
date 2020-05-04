import type {
  Attribute,
  Core,
  Expression,
  Expressions,
  ExpressionSexpOpcodeMap,
  Option,
  SerializedInlineBlock,
  SerializedTemplateBlock,
  SexpOpcodes,
  Statement,
  StatementSexpOpcodeMap,
  TupleExpression,
} from '@glimmer/interfaces';

export type ExpressionOp = TupleExpression[0];
export type StatementOp = Statement[0];
export type Op = ExpressionOp | StatementOp;

export interface StatementOpMap {
  AppendStatement: SexpOpcodes.Append;
  TrustingAppendStatement: SexpOpcodes.TrustingAppend;
  CommentStatement: SexpOpcodes.Comment;
  ModifierStatement: SexpOpcodes.Modifier;
  BlockStatement: SexpOpcodes.Block;
  ComponentStatement: SexpOpcodes.Component;

  OpenElementStatement: SexpOpcodes.OpenElement;
  OpenElementWithSplatStatement: SexpOpcodes.OpenElementWithSplat;
  FlushElementStatement: SexpOpcodes.FlushElement;
  CloseElementStatement: SexpOpcodes.CloseElement;
  StaticAttrStatement: SexpOpcodes.StaticAttr;
  DynamicAttrStatement: SexpOpcodes.DynamicAttr;
  ComponentAttrStatement: SexpOpcodes.ComponentAttr;

  AttrSplatStatement: SexpOpcodes.AttrSplat;
  YieldStatement: SexpOpcodes.Yield;
  PartialStatement: SexpOpcodes.Partial;

  DynamicArgStatement: SexpOpcodes.DynamicArg;
  StaticArgStatement: SexpOpcodes.StaticArg;
  TrustingDynamicAttrStatement: SexpOpcodes.TrustingDynamicAttr;
  TrustingComponentAttrStatement: SexpOpcodes.TrustingComponentAttr;
  StaticComponentAttrStatement: SexpOpcodes.StaticComponentAttr;

  DebuggerStatement: SexpOpcodes.Debugger;
}

export interface ExpressionOpMap {
  HasBlockExpression: SexpOpcodes.HasBlock;
  HasBlockParamsExpression: SexpOpcodes.HasBlockParams;
  UndefinedExpression: SexpOpcodes.Undefined;
  CallExpression: SexpOpcodes.Call;
  ConcatExpression: SexpOpcodes.Concat;
  GetSymbolExpression: SexpOpcodes.GetSymbol;
  GetFreeExpression: SexpOpcodes.GetFree;
  GetFreeInAppendSingleIdExpression: SexpOpcodes.GetFreeInAppendSingleId;
  GetFreeInExpressionExpression: SexpOpcodes.GetFreeInExpression;
  GetFreeInCallHeadExpression: SexpOpcodes.GetFreeInCallHead;
  GetFreeInBlockHeadExpression: SexpOpcodes.GetFreeInBlockHead;
  GetFreeInModifierHeadExpression: SexpOpcodes.GetFreeInModifierHead;
  GetFreeInComponentHeadExpression: SexpOpcodes.GetFreeInComponentHead;
}

export type ExpressionOpNames = {
  [TOp in TupleExpression[0]]: {
    [TName in keyof ExpressionOpMap]: ExpressionOpMap[TName] extends TOp
      ? TName
      : never;
  }[keyof ExpressionOpMap];
};

export type StatementOpNames = {
  [TOp in StatementOp]: {
    [TName in keyof StatementOpMap]: StatementOpMap[TName] extends TOp
      ? TName
      : never;
  }[keyof StatementOpMap];
};

export interface OpNames extends StatementOpNames, ExpressionOpNames {}

export type StatementOpName = StatementOpNames[StatementOp];
export type ExpressionOpName = ExpressionOpNames[ExpressionOp];
export type OpName = StatementOpName | ExpressionOpName;

export type Visit<TArg> =
  | ((arg: TArg) => void)
  | {
      enter(arg: TArg): void;
      exit(arg: TArg): void;
    };

export type ExpressionSexpMap = {
  [TName in keyof ExpressionOpMap]: ExpressionSexpOpcodeMap[ExpressionOpMap[TName]];
};

export type StatementSexpMap = {
  [TName in keyof StatementOpMap]: StatementSexpOpcodeMap[StatementOpMap[TName]];
};

export type SexpMap = StatementSexpMap & ExpressionSexpMap;

export interface VisitorArgs extends SexpMap {
  Block: SerializedTemplateBlock | SerializedInlineBlock;
  TemplateBlock: SerializedTemplateBlock;
  InlineBlock: SerializedInlineBlock;

  Statement: Statement;

  Expression: Expression;
  ValueExpression: Expressions.Value;
  TupleExpression: TupleExpression;

  Params: Option<Core.Params>;
  Param: Expression;

  Attributes: Attribute[];
  Attribute: Attribute;

  Hash: Core.Hash;
  HashEntry: [string, Expression];

  Blocks: Core.Blocks;
  NamedBlock: [string, SerializedInlineBlock];
}

export type VisitorKey = keyof VisitorArgs;
export type VisitorArg = VisitorArgs[VisitorKey];

export type TemplateWalker = {
  [TKey in VisitorKey]: (arg: VisitorArgs[TKey]) => void;
};

export type TemplateVisitor = {
  [TKey in VisitorKey]: Visit<VisitorArgs[TKey]>;
};
