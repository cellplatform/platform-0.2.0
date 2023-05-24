const { ModuleSpecs: Common, DevSpecs: ComonDev } = await import('sys.ui.react.common/specs');
const { ModuleSpecs: Dev } = await import('sys.ui.react.dev/specs');
const { Specs: Monaco } = await import('sys.ui.react.monaco/specs');
const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: WebRtc } = await import('sys.net.webrtc');
const { Specs: FsIndexedDb } = await import('sys.fs.indexeddb');
const { Specs: VendorStripe } = await import('vendor.stripe');
const { Specs: Crdt } = await import('sys.data.crdt');

// const { Specs: FarcasterSpecs } = await import('sys.net.fc');

export const Specs = {
  // ...FarcasterSpecs,

  ...WebRtc,
  ...Crdt,
  ...Monaco,
  ...Common,
  ...ComonDev,
  ...Dev,
  ...Media,
  ...FsIndexedDb,
  ...VendorStripe,
};
