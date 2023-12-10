import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Sample.01`]: () => import('../ui/ui.Sample.01/-SPEC'),
};

export default Specs;
