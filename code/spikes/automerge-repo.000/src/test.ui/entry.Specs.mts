export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'spike.automerge-repo.tests': () => import('./-TestRunner'),
  'spike.automerge-repo.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'spike.automerge-repo.ui.Sample': () => import('../ui/ui.Sample/-SPEC'),
};

export default Specs;
