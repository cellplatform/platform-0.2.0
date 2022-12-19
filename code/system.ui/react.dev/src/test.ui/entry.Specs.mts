export const SampleSpecs = {
  'sample.MyComponent': () => import('../test.sample/specs/MySample.SPEC'),
};

export const SelfDevSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
};
