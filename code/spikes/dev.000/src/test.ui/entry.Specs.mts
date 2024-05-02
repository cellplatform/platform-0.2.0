/**
 * Vime.js
 * https://vimejs.com/4.x/getting-started/installation#react
 */
import '@vime/core/themes/default.css';
import '@vime/core/themes/light.css';

/**
 * Tldraw (Whiteboard)
 * https://tldraw.dev
 */
import type { t } from '../common';

const { Specs: App } = await import('./entry.Specs.Localhost.mjs');
const { Specs: IndexedDb } = await import('sys.data.indexeddb/specs');
const { Specs: Fs } = await import('sys.fs.indexeddb/specs');

const {
  ModuleSpecs: Common,
  DevSpecs: ComonDev,
  SampleSpecs: CommonSample,
} = await import('sys.ui.react.common');
const { Specs: List } = await import('sys.ui.react.list');

const { ModuleSpecs: Dev } = await import('sys.ui.react.dev/specs');
const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: MediaImage } = await import('sys.ui.react.media.image/specs');
const { Specs: MediaVideo } = await import('sys.ui.react.media.video/specs');
const { Specs: Concept } = await import('sys.ui.react.concept/specs');

const { Specs: ExtMonaco } = await import('ext.lib.monaco/specs');
const { Specs: ExtMonacoCrdt } = await import('ext.lib.monaco.crdt/specs');
const { Specs: ExtAutomerge } = await import('ext.lib.automerge/specs');
const { Specs: ExtAutomergeWebrtc } = await import('ext.lib.automerge.webrtc/specs');
const { Specs: ExtStripe } = await import('ext.lib.stripe/specs');
const { Specs: ExtVimeo } = await import('ext.lib.vimeo/specs');
const { Specs: ExtAuthPrivy } = await import('ext.lib.privy/specs');
const { Specs: ExtPeerJs } = await import('ext.lib.peerjs/specs');
const { Specs: ExtDeno } = await import('ext.lib.deno/specs');

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
  ...Fs,
  ...Concept,

  ...ExtMonaco,
  ...ExtMonacoCrdt,

  ...ExtStripe,
  ...ExtVimeo,

  ...ExtAuthPrivy,
  ...ExtPeerJs,
  ...ExtAutomerge,
  ...ExtAutomergeWebrtc,
  ...ExtDeno,
} as t.SpecImports;
