import { describe, it, expect } from '../../test';
import { Dev } from '.';

describe('Dev', () => {
  it('exists', () => {
    expect(typeof Dev).to.eql('object');
  });
});
