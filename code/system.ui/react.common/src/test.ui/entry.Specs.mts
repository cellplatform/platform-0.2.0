export const Specs = {
  'sys.ui.Button': () => import('../ui/Button/index.SPEC'),
  'sys.ui.Button.Switch': () => import('../ui/Button.Switch/index.SPEC'),
  'sys.ui.Icon': () => import('../ui/Icon/Icon.SPEC'),
  'sys.ui.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.Center': () => import('../ui/Center/Center.SPEC'),
  'sys.ui.RenderCount': () => import('../ui/RenderCount/RenderCount.SPEC'),
  'sys.ui.ObjectView': () => import('../ui/ObjectView/ObjectView.SPEC'),
  // 'sys.ui.PropList': () => import('../ui/PropList/PropList.SPEC'),
  'sys.ui.MeasureSize': () => import('../ui.tools/Measure/index.SPEC'),
};

export const ExternalSpecs = {
  'sys.ui.useSizeObserver': () => import('./react.util/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner': () => import('../ui.dev/TestRunner/index.SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/DevTools.SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/ui.Button.SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Boolean/ui.Boolean.SPEC'),
};
