import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/Info/-dev/-SPEC'),
  [`${ns}.ui.Vimeo`]: () => import('../ui/Vimeo/-dev/-SPEC.Vimeo'),
  [`${ns}.ui.VimeoBackground`]: () => import('../ui/Vimeo/-dev/-SPEC.VimeoBg'),
};

export default Specs;
