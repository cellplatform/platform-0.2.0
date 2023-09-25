export { Pkg } from '../index.pkg.mjs';

export const Specs = {
  'ext.ui.vimeo.tests': () => import('./-TestRunner'),
  'ext.ui.vimeo.ui.Info': () => import('../ui/Info/-dev/-SPEC'),
  'ext.ui.vimeo.ui.Vimeo': () => import('../ui/Vimeo/-dev/-SPEC.Vimeo'),
  'ext.ui.vimeo.ui.VimeoBackground': () => import('../ui/Vimeo/-dev/-SPEC.VimeoBg'),
};

export default Specs;
