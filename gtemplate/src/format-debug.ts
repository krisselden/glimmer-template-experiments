import compiler from '@glimmer/compiler';
import type { SerializedTemplateBlock } from '@glimmer/interfaces';

export default function formatDebug(block: SerializedTemplateBlock): unknown {
  return new compiler.WireFormatDebugger(block).format();
}
