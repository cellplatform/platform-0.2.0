import { expect, Test } from '../test.ui';
import { ItemState } from './StateObject.mjs';
import { DEFAULTS } from './common';

export default Test.describe('<LabelItem>.State', (e) => {
  e.it('initial', (e) => {
    const state = ItemState.init();
    const value = state.current;
    expect(value).to.eql(DEFAULTS.data);
    expect(state.current).to.equal(value); // NB: no change, same instance.
  });

  e.it('change', (e) => {
    const state = ItemState.init();

    const before = state.current;
    state.change((draft) => (draft.label = 'hello'));
    const after = state.current;

    expect(before.label).to.eql(undefined);
    expect(after.label).to.eql('hello');
    expect(before).to.not.equal(after); // NB: different instance.
  });
});
