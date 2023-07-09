// import '@rainbow-me/rainbowkit/styles.css';

const { Specs: Crdt } = await import('sys.data.crdt/specs');
const { Specs: Fs } = await import('sys.fs.indexeddb/specs');
const { Specs: WebRtc } = await import('sys.net.webrtc/specs');

const { ModuleSpecs: Common, DevSpecs: ComonDev } = await import('sys.ui.react.common/specs');
const { ModuleSpecs: Dev } = await import('sys.ui.react.dev/specs');
const { Specs: Monaco } = await import('sys.ui.react.monaco/specs');
const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: MediaImage } = await import('sys.ui.react.media.image/specs');

const { Specs: VendorStripe } = await import('vendor.stripe/specs');
// const { Specs: VendorWallet } = await import('vendor.wallet.rainbow/specs');

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
  ...VendorStripe,
  // ...VendorWallet,
};
