export const Specs = {
  'sys.ui.common.Card': () => import('../ui/Card/Card.SPEC'),
  'sys.ui.common.Button': () => import('../ui/Button/Button.SPEC'),
  'sys.ui.common.Button.Switch': () => import('../ui/Button.Switch/Switch.SPEC'),
  'sys.ui.common.Icon': () => import('../ui/Icon/Icon.SPEC'),
  'sys.ui.common.IFrame': () => import('../ui/IFrame/IFrame.SPEC'),
  'sys.ui.common.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.common.Center': () => import('../ui/Center/Center.SPEC'),
  'sys.ui.common.RenderCount': () => import('../ui/RenderCount/RenderCount.SPEC'),
  'sys.ui.common.ObjectView': () => import('../ui/ObjectView/ObjectView.SPEC'),
  'sys.ui.common.PropList': () => import('../ui/PropList/PropList.SPEC'),
  'sys.ui.common.Text': () => import('../ui/Text/Text.SPEC'),
  'sys.ui.common.Text.Input': () => import('../ui/Text.Input/-dev/TextInput.SPEC'),
  'sys.ui.common.Text.Keyboard': () => import('../ui/Text.Keyboard/-dev/Keyboard.SPEC'),
  'sys.ui.common.Text.Secret': () => import('../ui/Text.Secret/TextSecret.SPEC'),
  'sys.ui.common.Text.Syntax': () => import('../ui/Text.Syntax/TextSyntax.SPEC'),
  'sys.ui.common.Measure': () => import('../ui.tools/Measure/Measure.SPEC'),
  'sys.ui.common.useFocus': () => import('../ui/useFocus/useFocus.SPEC'),
  'sys.ui.common.useSizeObserver': () => import('../ui/useSizeObserver/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner': () => import('../ui.dev/TestRunner/TestRunner.SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/DevTools.SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/DevTools.Hr.SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/DevTools.Button.SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Button/DevTools.Button.SPEC'),
  'sys.ui.dev.DevTools.Title': () => import('../ui.dev/DevTools.Title/DevTools.Title.SPEC'),
  'sys.ui.dev.DevTools.Todo': () => import('../ui.dev/DevTools.Todo/DevTools.Todo.SPEC'),
};

export default { ...Specs, ...DevSpecs };
