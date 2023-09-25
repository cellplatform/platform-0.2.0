export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.code.ui.MonacoEditor': () => import('../ui/MonacoEditor/-dev/-SPEC'),
  'sys.ui.code.ui.MonacoCrdt': () => import('../ui.logic/MonacoCrdt/-dev/-SPEC'),
  'sys.ui.code.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
