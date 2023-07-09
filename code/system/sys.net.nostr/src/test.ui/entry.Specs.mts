export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'sys.net.nostr.tests': () => import('./-TestRunner'),
  'sys.net.nostr.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'sys.net.nostr.ui.Sample': () => import('./-SPEC.Sample'),
};

export default Specs;
