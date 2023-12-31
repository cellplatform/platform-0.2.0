import { Store } from '.';
import { A, Is, describe, expect, it, rx, type t } from '../test';

type D = { count?: t.A.Counter };

describe('Store (base)', async () => {
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  const { store, initial, generator } = testSetup();

  it('Is.store', () => {
    const non = [true, 123, '', [], {}, null, undefined];
    non.forEach((value) => expect(Is.store(value)).to.eql(false));
    expect(Is.store(store)).to.eql(true);
    expect(Is.repo(store.repo)).to.eql(true);
  });

  describe('lifecycle', () => {
    it('dispose', () => {
      const store = Store.init();
      expect(store.disposed).to.eql(false);

      let count = 0;
      store.dispose$.subscribe(() => count++);
      store.dispose();
      store.dispose();
      expect(store.disposed).to.eql(true);
      expect(count).to.eql(1);
    });

    it('dispose$', () => {
      const { dispose, dispose$ } = rx.disposable();
      const store = Store.init({ dispose$ });
      expect(store.disposed).to.eql(false);

      let count = 0;
      store.dispose$.subscribe(() => count++);

      dispose();
      expect(store.disposed).to.eql(true);
      expect(count).to.eql(1);
    });
  });
});
