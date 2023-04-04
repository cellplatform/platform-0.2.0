import type { t } from '../../common.t';

type LineColumn = [number, number]; // Line, Column.

export type EditorCaretPosition = { line: number; column: number };

export type EditorCarets = t.Disposable & {
  readonly editor: t.MonacoCodeEditor;
  readonly current: EditorCaret[];
  id(id: string): EditorCaret;
  clear(): EditorCarets;
};

export type EditorCaret = t.Disposable & {
  readonly id: string;
  readonly color: string;
  readonly position: EditorCaretPosition;
  change(args: { position?: t.IRange | LineColumn | null; color?: string }): EditorCaret;
  eq(position?: t.IRange | LineColumn | null): boolean;
};
