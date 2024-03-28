import type { t } from './common';
export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.code.MonacoEditor': () => import('../ui/ui.MonacoEditor/-SPEC'),
  'sys.ui.code.Editor.Crdt': () => import('../ui.logic/Editor.Crdt/-SPEC'),
  'sys.ui.code.sample.wrapped.monaco-editor': () => import('../ui/ui.Sample.01/-SPEC'),
  'sys.ui.code.ui.MonacoCrdt__OLD': () => import('../ui.logic/MonacoCrdt__OLD/-dev/-SPEC'),
} as t.SpecImports;

export default Specs;
