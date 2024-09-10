import '@vime/core/themes/default.css';
import '@vime/core/themes/light.css';
import 'reactflow/dist/style.css';

import type { t } from '../common';

const { Specs: App } = await import('./entry.Specs.Localhost');
const { Specs: IndexedDb } = await import('sys.data.indexeddb');

const {
  ModuleSpecs: Common,
  DevSpecs: ComonDev,
  SampleSpecs: CommonSample,
} = await import('sys.ui.react.common');
const { Specs: List } = await import('sys.ui.react.common.list');

const { ModuleSpecs: Dev } = await import('sys.ui.react.dev');
const { Specs: Media } = await import('sys.ui.react.media');
const { Specs: MediaImage } = await import('sys.ui.react.media.image');
const { Specs: MediaVideo } = await import('sys.ui.react.media.video');

const { Specs: ExtMonaco } = await import('ext.lib.monaco');
const { Specs: ExtMonacoCrdt } = await import('ext.lib.monaco.crdt');
const { Specs: ExtReactflow } = await import('ext.lib.reactflow');
const { Specs: ExtVimeo } = await import('ext.lib.vimeo');

const { Specs: ExtAutomerge } = await import('ext.lib.automerge');
const { Specs: ExtAutomergeWebrtc } = await import('ext.lib.automerge.webrtc');
const { Specs: ExtPeerJs } = await import('ext.lib.peerjs');
const { Specs: ExtAuthPrivy } = await import('ext.lib.privy');
const { Specs: ExtStripe } = await import('ext.lib.stripe');
const { Specs: ExtDeno } = await import('ext.lib.deno');

export const Specs = {
  ...App,

  ...IndexedDb,
  ...Common,
  ...ComonDev,
  ...CommonSample,
  ...List,
  ...Dev,
  ...Media,
  ...MediaImage,
  ...MediaVideo,

  ...ExtMonaco,
  ...ExtMonacoCrdt,
  ...ExtReactflow,
  ...ExtVimeo,

  ...ExtAutomerge,
  ...ExtAutomergeWebrtc,

  ...ExtAuthPrivy,
  ...ExtPeerJs,
  ...ExtStripe,
  ...ExtDeno,
} as t.SpecImports;
