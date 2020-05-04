import { SerializedTemplateBlock } from '@glimmer/interfaces';

import type { OpCounts } from './new-op-counts';
import newTemplateWalker from './new-template-walker.js';

export default function countOps(
  template: SerializedTemplateBlock,
  counts: OpCounts
): void {
  const walker = newTemplateWalker({
    Statement(statement) {
      counts[statement[0]]++;
    },
    TupleExpression(sexp) {
      counts[sexp[0]]++;
    },
  });
  walker.TemplateBlock(template);
}
