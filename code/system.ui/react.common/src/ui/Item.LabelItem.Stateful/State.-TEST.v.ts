import { LabelItemStateful } from '.';
import { describe, expect, it, slug, type t } from '../../test';

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
    const dispatch = State.commands(state);
    const events = state.events();

    const fired: t.LabelItemCommand[] = [];
    events.command.$.subscribe((e) => fired.push(e));

    const tx = slug();
    state.change((d) => (d.command = { type: 'Item:Clipboard', payload: { action: 'Copy', tx } }));
    expect(fired.length).to.eql(1);
    expect(state.current.command).to.eql({
      type: 'Item:Clipboard',
      payload: { action: 'Copy', tx },
    });

    dispatch.clipboard('Paste');
    expect(fired.length).to.eql(2);
    expect((state.current.command?.payload as any).action).to.eql('Paste');

    events.dispose();
  });
});
