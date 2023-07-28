/**
 * RainbowKit
 */
// import '@rainbow-me/rainbowkit/styles.css';

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
const { Specs: MediaImage } = await import('sys.ui.react.image/specs');
const { Specs: Concept } = await import('sys.ui.react.concept/specs');

const { Specs: ExtProtocolHats } = await import('protocol.hats/specs');
const { Specs: ExtStripe } = await import('ext.stripe/specs');
const { Specs: ExtVime } = await import('ext.ui.react.vime/specs');
const { Specs: ExtVimeo } = await import('ext.ui.react.vimeo/specs');
// const { Specs: ProtocolHats } = await import('protocol.hats/specs');
// const { Specs: ExtWallet } = await import('ext.wallet.rainbow/specs');

export const Specs = {
  ...WebRtc,
  ...Crdt,
  ...Monaco,
  ...Common,
  ...ComonDev,
  ...Dev,
  ...Media,
  ...MediaImage,
  ...Fs,
  ...Concept,
  ...ExtStripe,
  ...ExtProtocolHats,
  ...ExtVime,
  ...ExtVimeo,
  // ...ExtWallet,
};
