import { LabelItemStateful } from '.';
import { describe, expect, it, type t } from '../../test';

type O = Record<string, unknown>;
const State = LabelItemStateful.State;

describe('LabelItem: State', () => {
  it('init', () => {
    const state = State.item({ label: 'foo' });
    expect(state.current.label).to.eql('foo'); // NB: initial value.

    state.change((d) => (d.label = 'hello'));
    expect(state.current.label).to.eql('hello'); // NB: initial value.
  });

  it('events', () => {
    const state = State.item({ label: 'foo' });
    const events = state.events();
    expect(state.current.label).to.eql('foo'); // NB: initial value.

    const fired: t.PatchChange<t.LabelItem>[] = [];
    events.$.subscribe((e) => fired.push(e));

    state.change((d) => (d.label = 'hello'));
    expect(fired.length).to.eql(1);
    expect(fired[0].to.label).to.eql('hello');
    expect(fired[0].from.label).to.eql('foo');

    events.dispose();
    state.change((d) => (d.label = 'foobar'));
    expect(fired.length).to.eql(1); // NB: no change because disposed.
  });

  it('events.cmd$ (command stream)', () => {
    const state = State.item({ label: 'foo' });
    const events = state.events();

    const cmd = (msg: string): t.LabelItemCommand => ({ type: 'Item:Test', payload: { msg } });
    const fired: t.LabelItemCommand[] = [];
    events.cmd$.subscribe((e) => fired.push(e));

    state.change((d) => (d.cmd = cmd('one')));
    state.change((d) => (d.cmd = cmd('two')));

    expect(fired.length).to.eql(2);
    expect(state.current.cmd).to.eql({ type: 'Item:Test', payload: { msg: 'two' } });

    events.dispose();
  });
});
