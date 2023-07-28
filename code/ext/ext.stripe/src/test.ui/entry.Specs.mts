export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.stripe': () => import('./-root.SPEC'),
};

export default Specs;
