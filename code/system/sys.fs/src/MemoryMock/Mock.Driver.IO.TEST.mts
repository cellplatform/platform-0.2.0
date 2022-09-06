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
  it('mock.onInfoRequest (override info)', async () => {
    const mock = MemoryMock.IO();
    mock.onInfoRequest((e) => {
      if (e.path === '/bird') {
        e.modify((info) => {
          info.hash = 'sha256-abc';
          info.exists = true;
          info.bytes = 1234;
          info.kind = 'file';
        });
      }
    });

    const res1 = await mock.io.info('path:foo/bar');
    const res2 = await mock.io.info('   path:bird   '); // NB: whitespace cleaned up.

    expect(res1.uri).to.eql('path:foo/bar');
    expect(res1.exists).to.eql(false);
    expect(res1.bytes).to.eql(-1);
    expect(res1.kind).to.eql('unknown');

    expect(res2.uri).to.eql('path:bird');
    expect(res2.exists).to.eql(true);
    expect(res2.bytes).to.eql(1234);
    expect(res2.kind).to.eql('file');
    expect(res2.hash).to.eql('sha256-abc');
  });

  it('mock.state', async () => {
    const mock = MemoryMock.IO();
    const png = MemoryMock.randomFile();

    expect(mock.getState()).to.eql({});

    await mock.io.write('path:foo.png', png.data);

    const state = mock.getState();
    expect(state['/foo.png'].data).to.eql(png.data);
    expect(state['/foo.png'].hash).to.eql(png.hash);
  });
});
