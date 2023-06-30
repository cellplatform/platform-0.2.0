import { Automerge, Crdt, Test, expect, type t } from '../test.ui';
import { CrdtFunc } from '.';

export default Test.describe('Func', (e) => {
  type TRoot = { fn?: t.CrdtFuncData };

  const setup = () => {
    const initial: TRoot = {};
    const root = Crdt.ref<TRoot>('foo', initial);
    const lens = Crdt.lens<TRoot, t.CrdtFuncData>(
      root,
      (d) => d.fn || (d.fn = { count: new Automerge.Counter(), params: {} }),
    );

    return {
      initial,
      root,
      lens,
    } as const;
  };

  e.it('init', async (e) => {
    const { lens } = setup();
    expect(lens.current.count.value).to.eql(0);

    const func = CrdtFunc.init(lens, (e) => {});
    expect(func.kind).to.eql('Crdt:Func');
    expect(func.disposed).to.eql(false);
  });

  e.it('run', async (e) => {
    type P = { msg: string };
    const { lens } = setup();
    const fired: t.CrdtFuncHandlerArgs[] = [];
    const func = CrdtFunc.init<TRoot, P>(lens, (e) => fired.push(e));

    expect(lens.current.count.value).to.eql(0);
    func.run({ msg: 'hello' });
    expect(lens.current.count.value).to.eql(1);

    console.log('fired', fired);
    expect(fired.length).to.eql(1);
    expect(fired[0].count).to.eql(1);
    expect(fired[0].params).to.eql({ msg: 'hello' });
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
