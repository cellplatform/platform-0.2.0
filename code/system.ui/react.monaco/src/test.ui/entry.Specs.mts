export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.code.ui.MonacoEditor': () => import('../ui/ui.MonacoEditor/-SPEC'),
  'sys.ui.code.ui.MonacoCrdt': () => import('../ui.logic/MonacoCrdt__OLD/-dev/-SPEC'),
  'sys.ui.code.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
