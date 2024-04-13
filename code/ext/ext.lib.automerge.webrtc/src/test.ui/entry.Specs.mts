import type { t } from './common';

import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.db`]: () => import('./TestDb.SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.NetworkConnection`]: () => import('../ui/ui.NetworkConnection/-SPEC'),
  [`${ns}.ui.PeerRepoList`]: () => import('../ui/ui.PeerRepoList/-SPEC'),
  [`${ns}.ui.Network.CmdHost`]: () => import('../ui/ui.Network.CmdHost/-SPEC'),
  [`${ns}.ui.Network.CmdHosts`]: () => import('../ui/ui.Network.CmdHosts/-SPEC'),
  [`${ns}.ui.Sample.TextboxSync`]: () => import('../ui/ui.Sample.TextboxSync/-SPEC'),
  [`${ns}.ui.Sample.01`]: () => import('../ui/ui.Sample.01/-SPEC'),
  [`${ns}.ui.Sample.02`]: () => import('../ui/ui.Sample.02/-SPEC'),
  [`${ns}.ui.Sample.03`]: () => import('../ui/ui.Sample.03/-SPEC'),
} as t.SpecImports;

export default Specs;
