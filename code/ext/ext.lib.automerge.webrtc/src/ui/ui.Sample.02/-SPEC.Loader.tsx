import { type t } from './common';

type P = {};
type R = {};

export type LoaderDef = {};

export async function loader(state: t.ImmutableRef<LoaderDef, {}>): Promise<JSX.Element> {
  // const s = network.store;

  const events = state.events();

  // events

  console.log('events', events);
  console.log('state.current', state.current);

  // lens.
  //
  return <div>hello</div>;
}
