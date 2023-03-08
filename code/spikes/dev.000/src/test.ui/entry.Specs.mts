import { ModuleSpecs as DevSpecs } from 'sys.ui.react.dev';
import { Specs as CommonSpecs, DevSpecs as ComonDevSpecs } from 'sys.ui.react.common';
import { Specs as MonacoSpecs } from 'sys.ui.react.monaco';
import { Specs as VideoSpecs } from 'sys.ui.react.video';
import { Specs as WebRtcSpecs } from 'sys.net.webrtc';
import { Specs as FsIndexedDbSpecs } from 'sys.fs.indexeddb';
import { Specs as VendorStripe } from 'vendor.stripe';
import { Specs as CrdtSpecs } from 'sys.data.crdt';

export const Specs = {
  Root: () => import('../ui/Root/Root.SPEC'),
  ...WebRtcSpecs,
  ...CrdtSpecs,
  ...MonacoSpecs,
  ...CommonSpecs,
  ...ComonDevSpecs,
  ...DevSpecs,
  ...VideoSpecs,
  ...FsIndexedDbSpecs,
  ...VendorStripe,
};
