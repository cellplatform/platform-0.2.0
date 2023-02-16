export const Specs = {
  'sys.crdt.sample': () => import('../test.sample/-SPEC'),
  'sys.crdt.lib.Automerge': () => import('../driver.Automerge/-SPEC'),
};

export default Specs;
