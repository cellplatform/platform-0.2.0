export { Pkg } from '../index.pkg.mjs';
export { Dev } from '../Dev.mjs';

export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/-SPEC'),
  'sys.ui.dev.SpecList': () => import('../ui/SpecList/-SPEC'),
};

export const SampleSpecs = {
  'dev.sample.MySample': () => import('../test.ui/sample.specs/-SPEC.MySample'),
  'dev.sample.DevTools': () => import('../test.ui/sample.DevTools/-SPEC'),
  'dev.sample.Empty': () => import('../test.ui/sample.specs/-SPEC.Empty'),
  // 'dev.sample.Error': () => import('../test.ui/sample.specs/-SPEC.Error'),
  // 'dev.sample.Fail': () => import('../test.ui/sample.specs/-SPEC.Fail'),
};

export const Specs = { ...ModuleSpecs, ...SampleSpecs };
