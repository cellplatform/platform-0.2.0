import { type t } from '../common';

const fn = () => import('../-SPEC');

export const specs: t.SpecImports = {
  'foo.sample.01': fn,
  'foo.sample.02': fn,
  'foo.bar': fn,
};
