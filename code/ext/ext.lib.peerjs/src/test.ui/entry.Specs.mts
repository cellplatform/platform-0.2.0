import type { t } from './common';
import { Pkg } from '../index.pkg';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.test.ui.PeerCard`]: () => import('../ui/ui.Dev.PeerCard/-SPEC'),
  [`${ns}.ui.Info`]: () => import('../ui/ui.Info/-SPEC'),
  [`${ns}.ui.AvatarTray`]: () => import('../ui/ui.AvatarTray/-SPEC'),
  [`${ns}.ui.Video`]: () => import('../ui/ui.Video/-SPEC'),
  [`${ns}.ui.Connector`]: () => import('../ui/ui.Connector/-SPEC'),
  [`${ns}.ui.Connector.MediaToolbar`]: () => import('../ui/ui.Connector.MediaToolbar/-SPEC'),
} as t.SpecImports;

export default Specs;
