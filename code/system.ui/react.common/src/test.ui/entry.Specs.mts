export const Specs = {
  'sys.ui.Icon': () => import('../ui/Icon/dev/Icon.SPEC'),
  'sys.ui.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.Center': () => import('../ui/Center/Center.SPEC'),
  'sys.ui.useSizeObserver': () => import('../test.ui.util.specs/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/DevTools.SPEC'),
};
