import { Immutable } from 'sys.util';
import { Store } from '../Store';
// import { PatchState } from '../Json.PatchState';
import { describe, expect, it, type t } from '../test';

describe('Immutable.events', () => {
  type D = { count: number };

  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = 0);
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  it('fires events by overriding change handler', async () => {
    const { store, generator } = testSetup();
    const doc = await generator();

    const change = doc.change;
    const events1 = doc.events();
    const events2 = Immutable.events(doc);
    expect(doc.change).to.not.equal(change);

    const fired1: t.DocChanged<D>[] = [];
    const fired2: t.ImmutableChange<D>[] = [];
    events1.changed$.subscribe((e) => fired1.push(e));
    events2.$.subscribe((e) => fired2.push(e));

    doc.change((d) => (d.count = 123));
    expect(fired1.length).to.eql(1);
    expect(fired2.length).to.eql(1);

    expect(fired1[0].patchInfo.before).to.eql({ count: 0 });
    expect(fired1[0].patchInfo.after).to.eql({ count: 123 });
    expect(fired2[0].from).to.eql({ count: 0 });
    expect(fired2[0].to).to.eql({ count: 123 });

    events2.dispose();
    expect(doc.change).to.equal(change);

    doc.change((d) => (d.count = 456));
    expect(fired1.length).to.eql(2);
    expect(fired2.length).to.eql(1); // NB: no change.
    expect(fired1[1].patchInfo.before).to.eql({ count: 123 });
    expect(fired1[1].patchInfo.after).to.eql({ count: 456 });

    events1.dispose();
    store.dispose();
  });
});
