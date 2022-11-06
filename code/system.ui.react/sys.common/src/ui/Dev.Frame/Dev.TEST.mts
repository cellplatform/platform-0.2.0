import { describe, it, expect } from '../../test/index.mjs';
import { DevFrame } from './index.mjs';

describe('Dev', () => {
  it('exists', () => {
    expect(typeof DevFrame).to.eql('function');
  });
});
