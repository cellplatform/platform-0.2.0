import { type t } from '../common';

const fn = () => import('../-SPEC');

export const specs: t.SpecImports = {
  foo: fn,
  foobar: fn,
};
