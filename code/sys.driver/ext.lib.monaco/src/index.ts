/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg';
export { Pkg };

/**
 * Library
 */
import { EditorCarets } from './ui/u.Editor.Carets';
import { MonacoEditor } from './ui/ui.MonacoEditor';
import { Wrangle } from './common';

export { EditorCarets, MonacoEditor };
export const Monaco = {
  Editor: MonacoEditor,
  Carets: EditorCarets,
  Wrangle,
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';
