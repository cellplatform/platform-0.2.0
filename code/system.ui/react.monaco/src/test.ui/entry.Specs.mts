export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.code.ui.MonacoEditor': () => import('../ui/ui.MonacoEditor/-SPEC'),
  'sys.ui.code.Editor.Crdt.Lens': () => import('../ui.logic/Editor.Crdt/-SPEC'),
  'sys.ui.code.Sample.wrapped.monaco-editor': () => import('../ui/ui.Sample.01/-SPEC'),
  'sys.ui.code.ui.MonacoCrdt__OLD': () => import('../ui.logic/MonacoCrdt__OLD/-dev/-SPEC'),
};

export default Specs;
