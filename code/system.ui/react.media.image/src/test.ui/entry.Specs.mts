export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.media.image.tests': () => import('./-TestRunner'),
  'sys.ui.media.image.Image': () => import('../ui/Image/-dev/-SPEC'),
};

export default Specs;
