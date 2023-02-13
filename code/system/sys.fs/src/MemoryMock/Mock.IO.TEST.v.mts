import { describe, expect, it } from '../test';
import { MemoryMock } from '.';

/**
 * NOTE: The remainder of the mock is deeply tested via the
 *       standardised 🌳[sys.fs.spec] module.
 *
 *       See 🌳[sys.fs.spec] for the full test suite, which has
 *       an incoming dependency on this the base [sys.fs] module.
 */

describe('MemoryMock: DriverIO (mocking helpers)', () => {
  it('mock.state', async () => {
    const mock = MemoryMock.IO();
    const png = MemoryMock.randomFile();

    expect(mock.getState()).to.eql({});

    await mock.driver.write('path:foo.png', png.data);

    const state1 = mock.getState();
    const state2 = mock.getState();
    expect(state1).to.not.equal(state2); // NB: Different object instance.
    expect(state1).to.eql(state2);

    expect(state1['/foo.png'].data).to.eql(png.data);
    expect(state1['/foo.png'].hash).to.eql(png.hash);
  });
});
