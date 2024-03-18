import { Doc } from '.';
import { Lens, Registry } from '../Doc.Lens';
import { Namespace } from '../Doc.Namespace';
import { A, describe, expect, it } from '../test';

describe('Doc API (index)', () => {
  it('splice', () => {
    expect(Doc.splice).to.equal(A.splice);
  });

  it('lens', () => {
    expect(Doc.Lens).to.equal(Lens);
    expect(Doc.lens).to.eql(Lens.init);
    expect(Doc.Lens.Registry).to.equal(Registry);
  });

  it('namespace', () => {
    expect(Doc.Namespace).to.equal(Namespace);
    expect(Doc.namespace).to.equal(Namespace.init);
  });
});
