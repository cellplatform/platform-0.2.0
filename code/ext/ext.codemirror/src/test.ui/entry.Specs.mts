export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.codemirror.tests': () => import('./-TestRunner'),
  'ext.codemirror.ui.Info': () => import('../ui/Info/-SPEC'),
};

export default Specs;
