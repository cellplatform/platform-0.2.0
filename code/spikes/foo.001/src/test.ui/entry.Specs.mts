export { Pkg } from '../index.pkg.mjs';

const { Specs: ExtAutomerge } = await import('ext.driver.automerge/specs');

export const Specs = {
  'foo.tests': () => import('./-TestRunner'),
  'foo.ui.Info': () => import('../ui/ui.Info/-SPEC'),

  ...ExtAutomerge,
};

export default Specs;
