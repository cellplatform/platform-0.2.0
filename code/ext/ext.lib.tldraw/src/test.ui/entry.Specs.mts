import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Canvas`]: () => import('../ui/ui.Canvas/-SPEC'),
  [`${ns}.ui.Canvas.Crdt`]: () => import('../ui/ui.Canvas.Crdt/-SPEC'),
};

export default Specs;
