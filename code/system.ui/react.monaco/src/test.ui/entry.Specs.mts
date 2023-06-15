export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.code.MonacoEditor': () => import('../ui/MonacoEditor/-dev/-SPEC'),
  'sys.ui.code.MonacoCrdt': () => import('../ui.logic/MonacoCrdt/-dev/-SPEC'),
};

export default Specs;
