/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { EditorCarets } from './ui/logic.Editor.Carets';
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
export { Specs } from './test.ui/entry.Specs.mjs';
