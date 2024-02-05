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
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
