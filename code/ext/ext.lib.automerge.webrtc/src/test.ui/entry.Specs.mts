import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.db`]: () => import('./TestDb.SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.Connection`]: () => import('../ui/ui.Connection/-SPEC'),
  [`${ns}.ui.Sample.01`]: () => import('../ui/ui.Sample.01/-SPEC'),
  [`${ns}.ui.Sample.02`]: () => import('../ui/ui.Sample.02/-SPEC'),
  [`${ns}.ui.Sample.02.edge`]: () => import('../ui/ui.Sample.02/-SPEC.edge'),
};

export default Specs;
