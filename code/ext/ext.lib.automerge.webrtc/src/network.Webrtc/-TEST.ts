import { Test, expect, type t } from '../test.ui';
import { WebrtcNetworkAdapter } from '.';

import { Webrtc } from 'ext.lib.peerjs';

export default Test.describe('WebrtcNetworkAdapter', (e) => {
  e.describe('intergration tests', (e) => {
    e.it('TODO', async (e) => {});

    e.it.skip('connects and syncs over WebRTC', async (e) => {
      /**
       * TODO 🐷
       */
      const options = Webrtc.PeerJs.options();
      console.log('options', options);
    });
  });
});
