export const Specs = {
  'sys.ui.Icon': () => import('../ui/Icon/dev/Icon.SPEC'),
  'sys.ui.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.Center': () => import('../ui/Center/Center.SPEC'),
  'sys.ui.useSizeObserver': () => import('../test.ui/sys.util.specs/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.RenderCount': () => import('../ui.dev/RenderCount/RenderCount.SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/DevTools.SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/ui.Button.SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/ui.Hr.SPEC'),
};
