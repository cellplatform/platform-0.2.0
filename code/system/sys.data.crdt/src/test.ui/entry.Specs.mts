export const Specs = {
  'sys.crdt.sample': () => import('../test.sample/-SPEC'),
  'sys.crdt.test-runner': () => import('./-dev/TestRunner.SPEC'),
};

export default Specs;
