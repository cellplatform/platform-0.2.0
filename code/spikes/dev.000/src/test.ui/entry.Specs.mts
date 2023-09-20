/**
 * Vime.js
 * https://vimejs.com/4.x/getting-started/installation#react
 */
import '@vime/core/themes/default.css';
import '@vime/core/themes/light.css';

const { Specs: Crdt } = await import('sys.data.crdt/specs');
const { Specs: Fs } = await import('sys.fs.indexeddb/specs');
const { Specs: WebRtc } = await import('sys.net.webrtc/specs');

const { ModuleSpecs: Common, DevSpecs: ComonDev } = await import('sys.ui.react.common/specs');
const { ModuleSpecs: Dev } = await import('sys.ui.react.dev/specs');
const { Specs: Monaco } = await import('sys.ui.react.monaco/specs');
const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: MediaImage } = await import('sys.ui.react.media.image/specs');
const { Specs: MediaVideo } = await import('sys.ui.react.media.video/specs');
const { Specs: Concept } = await import('sys.ui.react.concept/specs');

const { Specs: ExtProtocolHats } = await import('ext.driver.protocol.hats/specs');
const { Specs: ExtStripe } = await import('ext.stripe/specs');
const { Specs: ExtVimeo } = await import('ext.ui.react.vimeo/specs');
// const { Specs: ProtocolHats } = await import('ext.driver.protocol.hats/specs');
const { Specs: ExtAuthPrivy } = await import('ext.driver.auth.privy/specs');
const { Specs: ExtIpfsW3s } = await import('ext.driver.ipfs.w3s/specs');
// const { Specs: ExtVercelBlob } = await import('ext.vercel.blob/specs');

export const Specs = {
  App: () => import('../ui/App/-SPEC'),

  ...WebRtc,
  ...Crdt,
  ...Monaco,
  ...Common,
  ...ComonDev,
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
  ...ExtIpfsW3s,
};
