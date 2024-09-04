import { Immutable } from 'sys.util';
import { PatchState } from '../Json.PatchState';
import { describe, expect, it, slug, type t } from '../test';

describe('Immutable.events', () => {
  type D = { count: number };
  type P = t.PatchOperation;

  it('fires events by overriding change handler', () => {
    const obj = PatchState.create<D>({ count: 0 });
    const change = obj.change;
    const events1 = obj.events();
    const events2 = Immutable.events.viaOverride(obj);
    expect(obj.change).to.not.equal(change);

    const fired1: t.PatchChange<D>[] = [];
    const fired2: t.ImmutableChange<D, P>[] = [];
    events1.$.subscribe((e) => fired1.push(e));
    events2.changed$.subscribe((e) => fired2.push(e));

    obj.change((d) => (d.count = 123));
    expect(fired1.length).to.eql(1);
    expect(fired2.length).to.eql(1);
    expect(fired1[0].before).to.eql({ count: 0 });
    expect(fired1[0].after).to.eql({ count: 123 });

    expect(fired2[0].before).to.eql({ count: 0 });
    expect(fired2[0].after).to.eql({ count: 123 });

    events2.dispose();
    expect(obj.change).to.equal(change);

    obj.change((d) => (d.count = 456));
    expect(fired1.length).to.eql(2);
    expect(fired2.length).to.eql(1); // NB: no change.
    expect(fired1[1].before).to.eql({ count: 123 });
    expect(fired1[1].after).to.eql({ count: 456 });

    events1.dispose();
  });

  it('fires with "tx" identifier', () => {
    const obj = PatchState.create<D>({ count: 0 });
    const events = obj.events();

    const fired: t.PatchChange<D>[] = [];
    events.$.subscribe((e) => fired.push(e));

    const tx = `foo.${slug()}`;
    obj.change((d) => (d.count = 123), { tx });
    obj.change((d) => (d.count = 456));

    expect(fired.length).to.eql(2);
    expect(fired[0].tx).to.eql(tx);
    expect(fired[1].tx).to.eql(undefined);

    events.dispose();
  });
});
