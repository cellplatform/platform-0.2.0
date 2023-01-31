export const Specs = {
  'sample.MySample': () => import('./MySample.SPEC'),
  'sample.empty': () => import('./Empty.SPEC'),
  'sample.fail': () => import('./Fail.SPEC'),
  'sample.error': () => import('./Error.SPEC'),
};
