import { DocLens } from '.';
import { A, Is, describe, expect, it, rx, type t } from '../test';
import { Doc } from '../Doc';

describe('Doc.Lens', () => {
  it('references (API)', () => {
    expect(Doc.Lens).to.equal(DocLens);
  });
});
