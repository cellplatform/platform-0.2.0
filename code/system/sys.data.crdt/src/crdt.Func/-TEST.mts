import { CrdtFunc } from '.';
import { Crdt, Test, expect, type t } from '../test.ui';

export default Test.describe('Func', (e) => {
  type TRoot = {
    child: { fn?: t.CrdtFuncData };
  };

  const setup = () => {
    const initial: TRoot = { child: {} };
    const root = Crdt.ref<TRoot>('foo', initial);
    const lens = Crdt.lens<TRoot, t.CrdtFuncData>(root, (d) => CrdtFunc.data(d.child, 'fn'));
    return { initial, root, lens } as const;
  };

  e.it('exposed from root API', (e) => {
    expect(CrdtFunc.init).to.equal(Crdt.func);
    expect(Crdt.Func).to.equal(CrdtFunc);
  });

  e.describe('init', (e) => {
    e.it('initial values', (e) => {
      const { lens } = setup();
      expect(lens.current.count.value).to.eql(0);

      const func = CrdtFunc.init(lens, (e) => {});
      expect(func.kind).to.eql('Crdt:Func');
      expect(func.disposed).to.eql(false);
    });

    e.it('dispose', (e) => {
      const { lens } = setup();
      const func1 = CrdtFunc.init(lens, (e) => {});
      const func2 = CrdtFunc.init(lens, (e) => {});

      expect(func1.disposed).to.eql(false);
      expect(func2.disposed).to.eql(false);

      func1.dispose();
      expect(func1.disposed).to.eql(true);
      expect(func2.disposed).to.eql(false);
      expect(lens.disposed).to.eql(false);

      lens.dispose();
      expect(func1.disposed).to.eql(true);
      expect(func2.disposed).to.eql(true);
      expect(lens.disposed).to.eql(true);
    });
  });

  e.describe('run', (e) => {
    type P = { msg: string };

    e.it('run local', (e) => {
      const { lens } = setup();
      const fired: t.CrdtFuncHandlerArgs[] = [];
      const func = Crdt.func<P>(lens, (e) => fired.push(e));

      expect(lens.current.count.value).to.eql(0);
      func.invoke({ msg: 'hello' });
      expect(lens.current.count.value).to.eql(1);

      expect(fired.length).to.eql(1);
      expect(fired[0].count).to.eql(1);
      expect(fired[0].params).to.eql({ msg: 'hello' });
    });

    e.it('run from another function', async (e) => {
      const { lens } = setup();
      const fired1: t.CrdtFuncHandlerArgs[] = [];
      const fired2: t.CrdtFuncHandlerArgs[] = [];
      const func1 = Crdt.func<P>(lens, (e) => fired1.push(e));
      const func2 = Crdt.func<P>(lens, (e) => fired2.push(e));

      func1.invoke({ msg: 'hello' });
      expect(fired1.length).to.eql(1);
      expect(fired2.length).to.eql(1);

      func2.invoke({ msg: '👋' });
      expect(fired1.length).to.eql(2);
      expect(fired2.length).to.eql(2);

      expect(fired1[0].params).to.eql({ msg: 'hello' });
      expect(fired1[1].params).to.eql({ msg: '👋' });
      expect(fired2[0].params).to.eql({ msg: 'hello' });
      expect(fired2[1].params).to.eql({ msg: '👋' });
    });
  });
});
