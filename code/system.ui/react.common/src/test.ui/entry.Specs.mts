export const Specs = {
  'sys.ui.common.Card': () => import('../ui/Card/index.SPEC'),
  'sys.ui.common.Button': () => import('../ui/Button/index.SPEC'),
  'sys.ui.common.Button.Switch': () => import('../ui/Button.Switch/index.SPEC'),
  'sys.ui.common.Icon': () => import('../ui/Icon/Icon.SPEC'),
  'sys.ui.common.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.common.Center': () => import('../ui/Center/Center.SPEC'),
  'sys.ui.common.RenderCount': () => import('../ui/RenderCount/RenderCount.SPEC'),
  'sys.ui.common.ObjectView': () => import('../ui/ObjectView/ObjectView.SPEC'),
  // 'sys.ui.common.PropList': () => import('../ui/PropList/PropList.SPEC'),
  'sys.ui.common.Text.Syntax': () => import('../ui/Text.Syntax/dev/index.SPEC'),
  'sys.ui.common.Measure': () => import('../ui.tools/Measure/index.SPEC'),
};

export const ExternalSpecs = {
  'sys.ui.util.useSizeObserver': () => import('./react.util/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner': () => import('../ui.dev/TestRunner/index.SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/DevTools.SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/index.SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Boolean/index.SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/index.SPEC'),
  'sys.ui.dev.DevTools.Title': () => import('../ui.dev/DevTools.Title/index.SPEC'),
};
