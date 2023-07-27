export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.concept.tests': () => import('./-TestRunner'),
  'sys.ui.concept.Info': () => import('../ui/Info/-dev/-SPEC'),
  'sys.ui.concept.Slug': () => import('../ui/Concept.Slug/-SPEC'),
  'sys.ui.concept.Player': () => import('../ui/Concept.Player/-SPEC'),
};

export default Specs;
