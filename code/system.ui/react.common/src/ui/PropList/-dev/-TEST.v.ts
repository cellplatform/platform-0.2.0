import { PropList } from '..';
import { describe, expect, it } from '../../../test';

describe('PropList', () => {
  describe('PropList.fields', () => {
    type TField = 'Foo' | 'Bar' | 'Zoo';

    it('undefined ← defaults', () => {
      const defaults: TField[] = ['Foo', 'Zoo'];
      const res1 = PropList.Wrangle.fields(undefined);
      const res2 = PropList.Wrangle.fields(undefined, defaults);
      expect(res1).to.eql([]);
      expect(res2).to.eql(defaults);
    });

    it('dense array', async () => {
      const fields: TField[] = ['Foo', 'Zoo'];
      const res = PropList.Wrangle.fields(fields);
      expect(res).to.eql(fields);
      expect(res[0] === 'Foo').to.eql(true); // NB: inferred typed.
    });

    it('sparse array', () => {
      const fields: (TField | undefined | null)[] = ['Foo', undefined, 'Zoo', null, undefined];
      const res = PropList.Wrangle.fields(fields);
      expect(res).to.eql(['Foo', 'Zoo']);
    });
  });
});
