import { describe, expect, it } from '../-test.ts';

import { Rx } from '../u.Observable/mod.ts';
import { Is } from './mod.ts';

describe('Is (common flags)', () => {
  it('rx: observable | subject', () => {
    // NB: tested in the corresponding module file.
    expect(Is.observable).to.equal(Rx.Is.observable);
    expect(Is.subject).to.equal(Rx.Is.subject);
  });
});
