export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.fs': () => import('./-dev/root.SPEC'),
};

export default Specs;
