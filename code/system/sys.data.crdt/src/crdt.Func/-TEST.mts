import { Automerge, Crdt, Test, expect, type t } from '../test.ui';
import { CrdtFunc } from '.';

export default Test.describe('Func', (e) => {
  type TFunc = { count: number };
  type TRoot = { fn?: TFunc };

  const setup = () => {
    const initial: TRoot = {};
    const root = Crdt.ref<TRoot>('foo', initial);
    const lens = Crdt.lens<TRoot, TFunc>(root, (d) => d.fn || (d.fn = { count: 0 }));
    return { initial, root, lens } as const;
  };

  e.it('init', async (e) => {
    const { lens } = setup();
    expect(lens.current.count).to.eql(0);
  });
});
