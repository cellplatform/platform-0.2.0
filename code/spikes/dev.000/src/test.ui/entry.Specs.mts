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
import '@tldraw/tldraw/tldraw.css';

const { Specs: App } = await import('./entry.Specs.Localhost.mjs');

const { Specs: Crdt } = await import('sys.data.crdt/specs');
const { Specs: Fs } = await import('sys.fs.indexeddb/specs');

const {
  ModuleSpecs: Common,
  DevSpecs: ComonDev,
  SampleSpecs: CommonSample,
} = await import('sys.ui.react.common/specs');
const { ModuleSpecs: Dev } = await import('sys.ui.react.dev/specs');
const { Specs: Monaco } = await import('sys.ui.react.monaco/specs');
const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: MediaImage } = await import('sys.ui.react.media.image/specs');
const { Specs: MediaVideo } = await import('sys.ui.react.media.video/specs');
const { Specs: Concept } = await import('sys.ui.react.concept/specs');

const { Specs: ExtProtocolHats } = await import('ext.lib.protocol.hats/specs');
const { Specs: ExtStripe } = await import('ext.lib.stripe/specs');
const { Specs: ExtVimeo } = await import('ext.lib.vimeo/specs');
const { Specs: ExtAuthPrivy } = await import('ext.lib.auth.privy/specs');
const { Specs: ExtPeerJs } = await import('ext.lib.peerjs/specs');
const { Specs: ExtCodeMirror } = await import('ext.lib.codemirror/specs');
const { Specs: ExtAutomerge } = await import('ext.lib.automerge/specs');
const { Specs: ExtAutomergeWebrtc } = await import('ext.lib.automerge.webrtc/specs');
const { Specs: ExtTldraw } = await import('ext.lib.tldraw/specs');

export const Specs = {
  ...App,

  ...Crdt,
  ...Monaco,
  ...Common,
  ...ComonDev,
  ...CommonSample,
  ...Dev,
  ...Media,
  ...MediaImage,
  ...MediaVideo,
  ...Fs,
  ...Concept,

  ...ExtStripe,
  ...ExtProtocolHats,
  ...ExtVimeo,

  ...ExtAuthPrivy,
  ...ExtPeerJs,
  ...ExtAutomerge,
  ...ExtCodeMirror,
  ...ExtAutomergeWebrtc,
  ...ExtTldraw,
};
