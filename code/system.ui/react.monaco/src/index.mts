/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Code Editor
 */
export { MonacoEditor } from './ui/ui.MonacoEditor';
export { MonacoCrdt } from './ui.logic/MonacoCrdt__OLD';
export { EditorCrdt } from './ui.logic/Editor.Crdt';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
