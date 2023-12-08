export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.tldraw.tests': () => import('./-TestRunner'),
  'ext.lib.tldraw.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.tldraw.ui.Sample.01': () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
