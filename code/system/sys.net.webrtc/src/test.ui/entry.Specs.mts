import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const Specs = {
  [`'${ns}`]: () => import('../ui/ui.GroupVideo/-SPEC'),

  [`'${ns}.ui.Info`]: () => import('../ui/ui.Info/-dev/-SPEC'),
  [`'${ns}.ui.Info.PeerRow`]: () => import('../ui/ui.Info/-dev/-SPEC.PeerRow'),
  [`'${ns}.ui.Info.PeerCtrls`]: () => import('../ui/ui.Info/-dev/-SPEC.PeerCtrls'),
  [`'${ns}.ui.PeerId`]: () => import('../ui/ui.PeerId/-SPEC'),
  [`'${ns}.ui.PeerInput`]: () => import('../ui/ui.PeerInput/-SPEC'),
  [`'${ns}.ui.Connect`]: () => import('../ui/ui.Connect/-SPEC'),
  [`'${ns}.ui.GroupVideo`]: () => import('../ui/ui.GroupVideo/-SPEC'),

  [`'${ns}.tests`]: () => import('./-TestRunner'),

  [`'${ns}._archive.01`]: () => import('../WebRtc/-dev/-SPEC'),
  [`'${ns}._archive.01.ui.PeerCard`]: () => import('../ui/ui.PeerCard/-SPEC'),
  [`'${ns}._archive.01.ui.PeerList.Item`]: () => import('../ui/ui.PeerList.Item/-SPEC'),
  [`'${ns}._archive.01.ui.ide`]: () => import('../ui/ui.IDE/-SPEC'),
};

export default Specs;
