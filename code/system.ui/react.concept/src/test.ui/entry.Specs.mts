export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.ui.concept.tests': () => import('./-TestRunner'),
  'sys.ui.concept.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'sys.ui.concept.ui.ConceptSlug': () => import('../ui/Concept.Slug/-SPEC'),
  'sys.ui.concept.ui.PlayBar': () => import('../ui/ui.PlayBar/-SPEC'),
};

export default Specs;
