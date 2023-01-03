import { describe, it, expect, t } from '../../test';
import { DevTools } from '.';

describe('DevTools', () => {
  it('exist', () => {
    expect(DevTools).to.be.a('function');
  });
});
