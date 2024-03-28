import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/Info/-dev/-SPEC'),
  [`${ns}.ui.Sample`]: () => import('./-SPEC.Sample'),
};

export default Specs;
