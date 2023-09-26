export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.codemirror.tests': () => import('./-TestRunner'),
  'ext.lib.codemirror.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.codemirror.ui.Editor': () => import('../ui/ui.Editor/-SPEC'),
};

export default Specs;
