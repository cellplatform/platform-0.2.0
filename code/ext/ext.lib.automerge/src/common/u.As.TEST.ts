import { As } from '.';
import { WebStore } from '../Store.Web';
import { Test, expect } from '../test.ui';

export default Test.describe('As', (e) => {
  e.describe('As.array', (e) => {
    e.it('throw: not an array', (e) => {
      [true, 123, '', {}, null, undefined].forEach((value: any) => {
        const fn = () => As.array(value);
        expect(fn).to.throw(/Not an array/);
      });
    });

    e.it('throw: not an automerge array', (e) => {
      const fn = () => As.array([1, 2, 3]);
      expect(fn).to.throw(/Not an automerge array/);
    });

    e.it('exposes "deleteAt" function', async (e) => {
      type T = { items: number[] };
      const store = WebStore.init({ network: false, storage: false });
      const doc = await store.doc.getOrCreate<T>((d) => (d.items = [1, 2, 3]));
      doc.change((d) => As.array(d.items).deleteAt(1));
      expect(doc.current.items).to.eql([1, 3]);
      store.dispose();
    });
  });
});
