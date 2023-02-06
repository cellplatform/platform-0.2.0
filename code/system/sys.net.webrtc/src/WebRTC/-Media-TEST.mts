import { Dev, rx, expect } from '../test.ui';
import { Media } from './Media.mjs';

export default Dev.describe('WebRTC.Media', (e) => {
  const SECOND = 1000;
  e.timeout(15 * SECOND);

  e.it('singleton (default bus)', async (e) => {
    const res1 = Media.singleton();
    const res2 = Media.singleton();
    expect(res1).to.equal(res2);
  });

  e.it('singleton (explicit)', async (e) => {
    const bus = rx.bus();
    const res1 = Media.singleton({ bus });
    const res2 = Media.singleton({ bus });
    const res3 = Media.singleton({});
    expect(res1).to.equal(res2);
    expect(res1).to.not.equal(res3);
  });

  e.it('get stream → done', async (e) => {
    const bus = rx.bus();

    const media = Media.singleton({ bus });
    const stream = await media.getStream();

    const status1 = await media.events.status(media.ref).get();
    const tracks = status1.stream?.tracks ?? [];

    expect(status1.stream?.media instanceof MediaStream).to.eql(true);
    expect(tracks[0].kind).to.eql('audio');
    expect(tracks[1].kind).to.eql('video');

    await stream.done();

    const status2 = await media.events.status(media.ref).get();
    expect(status2.stream).to.eql(undefined);
  });
});
