import { describe, expect, it, type t } from '../test';
import { PatchState } from '.';

describe('PatchState', () => {
  type T = {
    label: string;
  };

  const initial: T = { label: 'foo' };

  it('init: (default)', (e) => {
    const state = PatchState.init<T>({ initial });
    const value = state.current;
    expect(value).to.eql(initial);
    expect(state.current).to.equal(value); // NB: no change, same instance.
  });

  it('init: specified {initial}', (e) => {
    const state = PatchState.init({ initial });
    const value = state.current;
    expect(value).to.eql({ label: 'foo' });
    expect(state.current).to.equal(value); // NB: no change, same instance.
  });

  it('init: instance { id }', (e) => {
    const state1 = PatchState.init({ initial });
    const state2 = PatchState.init({ initial });
    expect(state1.instance.id).to.not.eql(state2.instance.id);
  });

  it('change', (e) => {
    const state = PatchState.init({ initial });

    const before = state.current;
    state.change((draft) => (draft.label = 'hello'));
    const after = state.current;

    expect(before.label).to.eql('foo');
    expect(after.label).to.eql('hello');
    expect(before).to.not.equal(after); // NB: different instance.
  });

  it('onChange (callback → patches)', (e) => {
    const fired: t.PatchChange<T>[] = [];
    const state = PatchState.init({
      initial,
      onChange: (e) => fired.push(e),
    });

    state.change((draft) => (draft.label = 'hello'));

    expect(fired.length).to.eql(1);
    expect(fired[0].op).to.eql('update');
    expect(fired[0].to).to.eql({ label: 'hello' });
    expect(fired[0].patches.next.length).to.eql(1);
  });
});
