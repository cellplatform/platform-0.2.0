export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
};

export const SampleSpecs = {
  'sample.MySample': () => import('../test.ui/sample.specs/MySample.SPEC'),
  'sample.Empty': () => import('../test.ui/sample.specs/Empty.SPEC'),
  'sample.DevTools': () => import('../test.ui/sample.DevTools/DevTools.SPEC'),
};
