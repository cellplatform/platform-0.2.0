import type { t } from '../../common.t';

export type EditorCarets = t.Disposable & {
  readonly editor: t.MonacoCodeEditor;
  readonly current: EditorCaret[];
  id(id: string): EditorCaret;
  clear(): EditorCarets;
};

export type EditorCaret = t.Disposable & {
  readonly id: string;
  readonly color: string;
  readonly opacity: number;
  readonly selections: t.EditorRange[];
  change(args: EditorCaretChangeArgs): EditorCaret;
  eq(args: EditorCaretChangeArgs): boolean;
};

export type EditorCaretChangeArgs = {
  selections?: EditorRangesInput;
  color?: string;
  opacity?: number; // 0..1
};

export type EditorRangesInput =
  | t.EditorRange
  | t.EditorRange[]
  | t.CharPositionTuple
  | t.CharPositionTuple[]
  | null;

export type EditorRangeInput = t.EditorRange | t.CharPositionTuple | t.CharRangeTuple | null;
