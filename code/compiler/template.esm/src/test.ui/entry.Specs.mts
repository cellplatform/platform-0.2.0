import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Sample.01`]: () => import('../ui/ui.Sample.01/-SPEC'),
  [`${ns}.tests`]: () => import('./-TestRunner'),
};

export default Specs;
