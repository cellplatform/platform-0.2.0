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

    it('throw: not an array', () => {
      [true, 123, '', {}, null, undefined].forEach((value: any) => {
        const fn = () => Data.array(value);
        expect(fn).to.throw(/Not an array/);
      });
    });

    it('throw: not an automerge array', () => {
      const fn = () => Data.array([1, 2, 3]);
      expect(fn).to.throw(/Not an automerge array/);
    });
  });
});
