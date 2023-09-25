export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.lib.prosemirror.tests': () => import('./-TestRunner'),
  'ext.lib.prosemirror.ui.Info': () => import('../ui/ui.Info/-SPEC'),
  'ext.lib.prosemirror.ui.Example': () => import('../ui/ui.Example/-SPEC'),
};

export default Specs;
