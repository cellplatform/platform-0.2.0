import { Store } from '../Store';
import { describe, expect, it } from '../test';
import { Data } from './Data';

describe('Data', () => {
  describe('Array', () => {
    type D = { items: number[] };
    const store = Store.init();
    const generator = store.doc.factory<D>((d) => (d.items = []));

    it('deleteAt', async () => {
      const doc = await generator();
      doc.change((d) => (d.items = [1, 2, 3, 4, 5]));

      const assertItems = (value: number[]) => {
        expect(doc.current.items).to.eql(value);
      };

      doc.change((d) => Data.array(d.items).deleteAt(-1));
      assertItems([2, 3, 4, 5]);

      doc.change((d) => Data.array(d.items).deleteAt(0));
      assertItems([3, 4, 5]);

      doc.change((d) => Data.array(d.items).deleteAt(1));
      assertItems([3, 5]);

      doc.change((d) => Data.array(d.items).deleteAt(0, 99));
      assertItems([]);
    });
  });
});
