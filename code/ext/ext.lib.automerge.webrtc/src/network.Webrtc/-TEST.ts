import { Test, expect, type t } from '../test.ui';
import { WebrtcNetworkAdapter } from '.';

import { Webrtc } from 'ext.lib.peerjs';

export default Test.describe('WebrtcNetworkAdapter', (e) => {
  e.describe.skip('intergration tests', (e) => {
    e.it('connects and syncs over WebRTC', async (e) => {
      /**
       * TODO 🐷
       */
      const options = Webrtc.PeerJs.options();
      console.log('options', options);
    });
  });
});
