import { Is } from '.';
import { Doc, Store, describe, expect, it } from '../test';

describe('Is (flags)', () => {
  const NON_OBJECTS = [true, 123, '', [], {}, null, undefined];

  describe('inherited from [ext.lib.automerge]', () => {
    it('Is.store', () => {
      const store = Store.init();
      expect(Is.store(store)).to.eql(true);
      NON_OBJECTS.forEach((value) => expect(Is.store(value)).to.eql(false));
      store.dispose();
    });

    it('Is.namespace', async () => {
      type TRoot = { count: number };
      const store = Store.init();
      const doc = await store.doc.getOrCreate<TRoot>((d) => (d.count = 0));
      const ns = Doc.namespace(doc);
      expect(Is.namespace(ns)).to.eql(true);
      NON_OBJECTS.forEach((value) => expect(Is.namespace(value)).to.eql(false));
      store.dispose();
    });
  });
});
