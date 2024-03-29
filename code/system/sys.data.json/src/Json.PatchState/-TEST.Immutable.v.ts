import { Immutable } from 'sys.util';
import { PatchState } from '../Json.PatchState';
import { describe, expect, it, type t } from '../test';

describe('Immutable.events', () => {
  type D = { count: number };

  it('fires events by overriding change handler', () => {
    const obj = PatchState.init<D>({ initial: { count: 0 } });
    const change = obj.change;
    const events1 = obj.events();
    const events2 = Immutable.events(obj);
    expect(obj.change).to.not.equal(change);

    const fired1: t.PatchChange<D>[] = [];
    const fired2: t.ImmutableChange<D>[] = [];
    events1.$.subscribe((e) => fired1.push(e));
    events2.$.subscribe((e) => fired2.push(e));

    obj.change((d) => (d.count = 123));
    expect(fired1.length).to.eql(1);
    expect(fired2.length).to.eql(1);
    expect(fired1[0].from).to.eql({ count: 0 });
    expect(fired1[0].to).to.eql({ count: 123 });
    expect(fired2[0].from).to.eql({ count: 0 });
    expect(fired2[0].to).to.eql({ count: 123 });

    events2.dispose();
    expect(obj.change).to.equal(change);

    obj.change((d) => (d.count = 456));
    expect(fired1.length).to.eql(2);
    expect(fired2.length).to.eql(1); // NB: no change.
    expect(fired1[1].from).to.eql({ count: 123 });
    expect(fired1[1].to).to.eql({ count: 456 });

    events1.dispose();
  });
});
