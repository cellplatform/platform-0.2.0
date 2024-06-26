import type { t } from './common';

import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.db`]: () => import('./TestDb.SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.PeerRepoList`]: () => import('../ui/ui.PeerRepoList/-SPEC'),
  [`${ns}.ui.Network.Connection`]: () => import('../ui/ui.Network.Connection/-SPEC'),
  [`${ns}.ui.Sample.TextboxSync`]: () => import('../ui/ui.Sample.TextboxSync/-SPEC'),
  [`${ns}.ui.Sample.01`]: () => import('../ui/ui.Sample.01/-SPEC'),
  [`${ns}.ui.Sample.02`]: () => import('../ui/ui.Sample.02/-SPEC'),
} as t.SpecImports;

export default Specs;
