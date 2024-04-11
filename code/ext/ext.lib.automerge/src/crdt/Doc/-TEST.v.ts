import { Doc } from '.';
import { describe, expect, it } from '../../test';
import { Lens, Registry } from '../Doc.Lens';
import { Namespace } from '../Doc.Namespace';

describe('Doc API (index)', () => {
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
