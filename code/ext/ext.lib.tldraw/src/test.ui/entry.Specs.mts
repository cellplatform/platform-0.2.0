export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.tldraw.tests': () => import('./-TestRunner'),
  'ext.lib.tldraw.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.tldraw.ui.Canvas': () => import('../ui/ui.Canvas/-SPEC'),
};

export default Specs;
