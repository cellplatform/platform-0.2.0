export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.vercel.blob.tests': () => import('./-TestRunner'),
  'ext.vercel.blob.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.vercel.blob.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
