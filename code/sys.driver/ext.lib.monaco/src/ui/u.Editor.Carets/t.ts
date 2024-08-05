import type { t } from '../common';

export type EditorCarets = t.Disposable & {
  readonly $: t.Observable<EditorCaretChanged>;
  readonly editor: t.MonacoCodeEditor;
  readonly current: EditorCaret[];
  readonly disposed: boolean;
  identity(id: string): EditorCaret;
  clear(): EditorCarets;
};

export type EditorCaret = t.Disposable & {
  readonly $: t.Observable<EditorCaretChanged>;
  readonly id: string;
  readonly color: string;
  readonly opacity: number;
  readonly selections: t.EditorRange[];
  readonly disposed: boolean;
  change(args: EditorCaretChangeArgs): EditorCaret;
  eq(args: EditorCaretChangeArgs): boolean;
};

export type EditorCaretChangeArgs = {
  selections?: t.EditorRangesInput;
  color?: string;
  opacity?: number; // 0..1
};

export type EditorCaretChanged = {
  id: string;
  current: t.EditorRange[];
  disposed: boolean;
};
