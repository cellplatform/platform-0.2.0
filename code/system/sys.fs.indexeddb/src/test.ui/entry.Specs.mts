export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.fs': () => import('./-dev/-TestRunner'),
};

export default Specs;
