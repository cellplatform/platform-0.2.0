export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ns.root.SAMPLE': () => import('../ui/-SPEC'),
  'sys.data.project': () => import('../sys.data.project/-dev/-SPEC.js'),
};

export default Specs;
