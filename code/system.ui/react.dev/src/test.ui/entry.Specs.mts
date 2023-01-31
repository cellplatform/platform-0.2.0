export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/Harness.SPEC'),
  'sys.ui.dev.SpecList': () => import('../ui/Entry.SpecList/SpecList.SPEC'),
};

export const SampleSpecs = {
  'dev.sample.MySample': () => import('../test.ui/sample.specs/MySample.SPEC'),
  'dev.sample.DevTools': () => import('../test.ui/sample.DevTools/DevTools.SPEC'),
  'dev.sample.Empty': () => import('../test.ui/sample.specs/Empty.SPEC'),
  'dev.sample.Error': () => import('../test.ui/sample.specs/Error.SPEC'),
  'dev.sample.Fail': () => import('../test.ui/sample.specs/Fail.SPEC'),
};

export default { ...ModuleSpecs, ...SampleSpecs };
