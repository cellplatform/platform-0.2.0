export const SampleSpecs = {
  'sample.MySample': () => import('../test.sample/specs/MySample.SPEC'),
  'sample.DevTools.Button': () => import('../test.sample/sample.ui.DevTools/s.ui.Button.SEPC'),
};

export const SelfDevSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
};
