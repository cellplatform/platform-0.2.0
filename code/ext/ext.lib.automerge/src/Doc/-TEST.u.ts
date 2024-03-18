import { Store } from '../Store';
import { type t } from '../test';

export type D = { count: number; msg?: string };
export function testSetup() {
  const store = Store.init();
  const initial: t.ImmutableNext<D> = (d) => (d.count = 0);
  const generator = store.doc.factory<D>(initial);
  return { store, initial, generator } as const;
}
