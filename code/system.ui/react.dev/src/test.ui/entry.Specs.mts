export const SampleSpecs = {
  'sample.MyComponent': () => import('../test.sample/MySample.SPEC'),
};

export const SelfDevSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
};
