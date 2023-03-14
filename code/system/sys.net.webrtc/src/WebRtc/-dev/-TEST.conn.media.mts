import { cuid, Dev, expect, t, TEST, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRtc: Media Connection', (e) => {
  e.timeout(1000 * 15);

  e.describe('connection: media', async (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    const Media = WebRtc.Media.singleton();
    const getStream = Media.getStream;
    const getMediaStatus = async () => Media.events.status(Media.ref.camera).get();

    e.it('init: create peers A ⇔ B', async (e) => {
      const [a, b] = await TestNetwork.peers(2, { getStream });
      peerA = a;
      peerB = b;
    });

    e.it(
      'open [media:camera/data] connection → close (last) data-connection → auto closes media-connection',
      async (e) => {
        const status1 = await getMediaStatus();
        expect(status1.stream).to.eql(undefined);

        const data1 = await peerA.data(peerB.id);
        const data2 = await peerA.data(peerB.id);
        const media = await peerA.media(peerB.id, 'camera');

        await Time.wait(300);

        expect(data1.isOpen).to.eql(true);
        expect(data2.isOpen).to.eql(true);
        expect(media.isOpen).to.eql(true);

        const status2 = await getMediaStatus();
        expect(status2.stream?.media instanceof MediaStream).to.eql(true);

        expect(peerA.connections.data.length).to.eql(2);
        expect(peerB.connections.data.length).to.eql(2);

        expect(peerA.connections.media.length).to.eql(1);
        expect(peerB.connections.media.length).to.eql(1);

        /**
         * Close the first data-connection.
         * This should have no effect on the media connection.
         */
        data1.dispose();
        await Time.wait(300);
        const status3 = await getMediaStatus();

        expect(status3.stream?.media instanceof MediaStream).to.eql(true);
        expect(peerA.connections.media.length).to.eql(1);
        expect(peerB.connections.media.length).to.eql(1);

        /**
         * Close the first data-connection.
         * This should auto-close the media connection.
         */
        data2.dispose();
        await Time.wait(300);
        const status4 = await getMediaStatus();

        expect(status4.stream?.media).to.eql(undefined);
        expect(peerA.connections.length).to.eql(0);
        expect(peerB.connections.length).to.eql(0);

        expect(data1.isOpen).to.eql(false);
        expect(data2.isOpen).to.eql(false);
        expect(media.isOpen).to.eql(false);
      },
    );

    e.it('dispose: peers (A | B)', async (e) => {
      peerA.dispose();
      peerB.dispose();
      expect(peerA.disposed).to.eql(true);
      expect(peerB.disposed).to.eql(true);
    });
  });
});
