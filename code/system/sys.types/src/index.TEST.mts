import { expect, describe, it, t } from './TEST/index.mjs';
// import { descrive, } from 'vitest';

describe('sys.types', () => {
  it('<placeholder>', async () => {
    // NB: Ensures at least one test exists in the module (so test-runner does not fail).
    const event: t.Event = { type: 'foo', payload: {} };
    expect(event.type).to.equal('foo');
  });
});
