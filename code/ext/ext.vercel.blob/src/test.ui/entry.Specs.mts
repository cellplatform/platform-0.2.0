export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.vercel.blob.tests': () => import('./-TestRunner'),
  'ext.vercel.blob.ui.Info': () => import('../ui/ui.Info/-SPEC'),
};

export default Specs;
