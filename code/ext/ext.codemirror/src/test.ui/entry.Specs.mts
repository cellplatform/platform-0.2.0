export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.codemirror.tests': () => import('./-TestRunner'),
  'ext.codemirror.ui.Info': () => import('../ui/Info/-SPEC'),
  'ext.codemirror.ui.Editor': () => import('../ui/ui.Editor/-SPEC'),
};

export default Specs;
