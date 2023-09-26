export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.stripe': () => import('./-root.SPEC'),
};

export default Specs;
