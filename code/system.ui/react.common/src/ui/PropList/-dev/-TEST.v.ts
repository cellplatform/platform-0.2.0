import { describe, it, expect, type t } from '../../../test';
import { PropList } from '..';

describe('PropList', () => {
  describe('PropList.fields', () => {
    type TField = 'Foo' | 'Bar' | 'Zoo';

    it('undefined', () => {
      expect(PropList.Wrangle.fields()).to.eql([]);
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
