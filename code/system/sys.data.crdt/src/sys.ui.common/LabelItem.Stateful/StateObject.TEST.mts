import { Test, expect, type t } from '../test.ui';
import { StateObject } from './StateObject.mjs';
import { DEFAULTS } from './common';

export default Test.describe('LabelItem: StateObject', (e) => {
  e.it('init: (default)', (e) => {
    const state = StateObject.init();
    const value = state.current;
    expect(value).to.eql(DEFAULTS.data);
    expect(state.current).to.equal(value); // NB: no change, same instance.
  });

  e.it('init: specified {initial}', (e) => {
    const initial: t.LabelItemData = { label: 'foo' };
    const state = StateObject.init({ initial });
    const value = state.current;
    expect(value).to.eql({ label: 'foo' });
    expect(state.current).to.equal(value); // NB: no change, same instance.
  });

  e.it('init: instance { id }', (e) => {
    const state1 = StateObject.init();
    const state2 = StateObject.init();
    expect(state1.instance.id).to.not.eql(state2.instance.id);
  });

  e.it('change', (e) => {
    const state = StateObject.init();

    const before = state.current;
    state.change((draft) => (draft.label = 'hello'));
    const after = state.current;

    expect(before.label).to.eql(undefined);
    expect(after.label).to.eql('hello');
    expect(before).to.not.equal(after); // NB: different instance.
  });

  e.it('onChange (callback → patches)', (e) => {
    const fired: t.PatchChange<t.LabelItemData>[] = [];
    const state = StateObject.init({
      onChange: (e) => fired.push(e),
    });

    state.change((draft) => (draft.label = 'hello'));

    expect(fired.length).to.eql(1);
    expect(fired[0].op).to.eql('update');
    expect(fired[0].to).to.eql({ label: 'hello' });
    expect(fired[0].patches.next.length).to.eql(1);
    expect(fired[0].patches.next).to.eql([{ op: 'add', path: 'label', value: 'hello' }]);
  });
});
