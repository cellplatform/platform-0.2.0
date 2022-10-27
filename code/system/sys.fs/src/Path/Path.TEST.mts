import { expect, describe, it } from '../test/index.mjs';
import { Path, PathUri } from './index.mjs';

/**
 * Remaining tests for [Path] found in [sys.util]
 */
describe('Path', () => {
  it('Uri', () => {
    expect(Path.Uri).to.equal(PathUri);
  });
});
