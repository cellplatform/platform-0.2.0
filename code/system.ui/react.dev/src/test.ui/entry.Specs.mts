export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
  'sys.ui.dev.SpecList': () => import('../ui/Entry.SpecList/SpecList.SPEC'),
};

export const SampleSpecs = {
  'sample.MySample': () => import('../test.ui/sample.specs/MySample.SPEC'),
  'sample.DevTools': () => import('../test.ui/sample.DevTools/DevTools.SPEC'),
  'sample.Empty': () => import('../test.ui/sample.specs/Empty.SPEC'),
};

export default { ...ModuleSpecs, ...SampleSpecs };
