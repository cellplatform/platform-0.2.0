import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Dev.Reload`]: () => import('../ui/ui.Dev.Reload/-SPEC'),
  [`${ns}.ui.Dev.DbList`]: () => import('../ui/ui.Dev.DbList/-SPEC'),
};

export default Specs;
