export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'vendor.stripe': () => import('./-root.SPEC'),
};

export default Specs;
