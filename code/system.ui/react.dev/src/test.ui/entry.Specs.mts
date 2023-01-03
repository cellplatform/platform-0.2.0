export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
};

export const SampleSpecs = {
  'sample.MySample': () => import('../test.ui/sample.specs/MySample.SPEC'),
  'sample.DevTools.Button': () => import('../test.ui/sample.DevTools/s.ui.Button.SPEC'),
};
