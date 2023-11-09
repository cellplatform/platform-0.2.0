export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.data.schema.tests': () => import('./-TestRunner'),
};

export default Specs;
