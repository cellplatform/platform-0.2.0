import { describe, it, expect } from '../../test';
import { DevFrame } from '.';

describe('Dev', () => {
  it('exists', () => {
    expect(typeof DevFrame).to.eql('function');
  });
});
