import { Dev, rx, expect, WebRtc } from '../test.ui';

export default Dev.describe('Media (Stream Input)', (e) => {
  const SECOND = 1000;
  e.timeout(15 * SECOND);

  e.it('singleton (default bus)', async (e) => {
    const res1 = WebRtc.Media.singleton();
    const res2 = WebRtc.Media.singleton();
    expect(res1).to.equal(res2);
  });

  e.it('singleton (explicit)', async (e) => {
    const bus = rx.bus();
    const res1 = WebRtc.Media.singleton({ bus });
    const res2 = WebRtc.Media.singleton({ bus });
    const res3 = WebRtc.Media.singleton({});
    expect(res1).to.equal(res2);
    expect(res1).to.not.equal(res3);
  });

  e.it('get stream ("media:camera") → done', async (e) => {
    const bus = rx.bus();

    const media = WebRtc.Media.singleton({ bus });
    const stream = await media.getStream('camera');

    const status1 = await media.events.status(media.ref.camera).get();
    const tracks = status1.stream?.tracks ?? [];

    expect(status1.stream?.media instanceof MediaStream).to.eql(true);
    expect(tracks[0].kind).to.eql('audio');
    expect(tracks[1].kind).to.eql('video');

    await stream.done();

    const status2 = await media.events.status(media.ref.camera).get();
    expect(status2.stream).to.eql(undefined);
  });
});
