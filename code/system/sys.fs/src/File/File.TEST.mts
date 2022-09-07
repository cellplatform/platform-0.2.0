import { describe, it, expect } from '../TEST/index.mjs';
import { File, FileUri } from './index.mjs';

describe('File', () => {
  it('exposes [FileUri]', () => {
    expect(File.Uri).to.equal(FileUri);
  });
});
