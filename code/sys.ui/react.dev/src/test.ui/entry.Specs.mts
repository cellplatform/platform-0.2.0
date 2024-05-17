import type { t } from './common';
export { Dev } from '../Dev';
export { Pkg } from '../index.pkg.mjs';

export const ModuleSpecs = {
  'sys.ui.dev.Harness': () => import('../ui/Harness/-SPEC'),
  'sys.ui.dev.ModuleList': () => import('../ui/List.Module/-SPEC'),
  // 'sys.ui.dev.list.SpecList': () => import('../ui/List.Spec/-SPEC'),
} as t.SpecImports;

export const SampleSpecs = {
  'dev.sample.MySample': () => import('../test.ui/sample.specs/-SPEC.MySample'),
  'dev.sample.DevTools': () => import('../test.ui/sample.DevTools/-SPEC'),
  'dev.sample.EmptyDiv': () => import('../test.ui/sample.specs/-SPEC.EmptyDiv'),
  'dev.sample.Empty': () => import('../test.ui/sample.specs/-SPEC.Empty'),
  // 'dev.sample.Error': () => import('../test.ui/sample.specs/-SPEC.Error'),
  // 'dev.sample.Fail': () => import('../test.ui/sample.specs/-SPEC.Fail'),
} as t.SpecImports;

export const Specs = {
  ...ModuleSpecs,
  ...SampleSpecs,
} as t.SpecImports;
