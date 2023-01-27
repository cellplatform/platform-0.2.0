import { expect, describe, it } from '../test';
import { Path, PathUri } from '.';

/**
 * Remaining tests for [Path] found in [sys.util]
 */
describe('Path', () => {
  it('Uri', () => {
    expect(Path.Uri).to.equal(PathUri);
  });
});
