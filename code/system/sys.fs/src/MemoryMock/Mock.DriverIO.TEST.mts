import { describe, expect, it } from '../TEST/index.mjs';
import { MemoryMock } from './index.mjs';

/**
 * NOTE: The remainder of the mock is deeply tested via the
 *       standardised 🌳[sys.fs.spec] module.
 *
 *       See 🌳[sys.fs.spec] for the full test suite, which has
 *       an incoming dependency on this the base [sys.fs] module.
 */

describe('MemoryMock: DriverIO (mocking helpers)', () => {
  it('onInfoRequest', async () => {
    const mock = MemoryMock.IO();
    mock.onInfoRequest((e) => {
      if (e.path === '/bird') {
        e.modify((info) => {
          info.exists = true;
          info.bytes = 1234;
          info.kind = 'file';
        });
      }
    });

    const res1 = await mock.io.info('path:foo/bar');
    const res2 = await mock.io.info('path:bird');

    expect(res1.exists).to.eql(false);
    expect(res1.bytes).to.eql(-1);
    expect(res1.kind).to.eql('unknown');

    expect(res2.exists).to.eql(true);
    expect(res2.bytes).to.eql(1234);
    expect(res2.kind).to.eql('file');
  });

  it('state', async () => {
    const mock = MemoryMock.IO();
    const png = MemoryMock.randomFile();

    expect(mock.state).to.eql({});
    await mock.io.write('path:foo.png', png.data);

    expect(mock.state['/foo.png'].data).to.eql(png.data);
    expect(mock.state['/foo.png'].hash).to.eql(png.hash);
  });
});
