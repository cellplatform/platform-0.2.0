import { describe, it, expect } from '../../test/index.mjs';
import { Dev } from './index.mjs';

describe('Dev', () => {
  it('exists', () => {
    expect(typeof Dev).to.eql('object');
  });
});
