export const Specs = {
  'sys.ui.common.Card': () => import('../ui/Card/Card.SPEC'),
  'sys.ui.common.Button': () => import('../ui/Button/Button.SPEC'),
  'sys.ui.common.Button.Switch': () => import('../ui/Button.Switch/Switch.SPEC'),
  'sys.ui.common.Icon': () => import('../ui/Icon/Icon.SPEC'),
  'sys.ui.common.IFrame': () => import('../ui/IFrame/IFrame.SPEC'),
  'sys.ui.common.Spinner': () => import('../ui/Spinner/Spinner.SPEC'),
  'sys.ui.common.Center': () => import('../ui/Center/-SPEC'),
  'sys.ui.common.RenderCount': () => import('../ui/RenderCount/RenderCount.SPEC'),
  'sys.ui.common.ObjectView': () => import('../ui/ObjectView/ObjectView.SPEC'),
  'sys.ui.common.ProgressBar': () => import('../ui/ProgressBar/-SPEC'),
  'sys.ui.common.QRCode': () => import('../ui/QRCode/QRCode.SPEC'),
  'sys.ui.common.PropList': () => import('../ui/PropList/PropList.SPEC'),
  'sys.ui.common.Text': () => import('../ui/Text/Text.SPEC'),
  'sys.ui.common.Text.Font': () => import('../ui/Text.Font/Font.SPEC'),
  'sys.ui.common.Text.Input': () => import('../ui/Text.Input/-dev/TextInput.SPEC'),
  'sys.ui.common.Text.Keyboard': () => import('../ui/Text.Keyboard/Keyboard.SPEC'),
  'sys.ui.common.Text.Secret': () => import('../ui/Text.Secret/TextSecret.SPEC'),
  'sys.ui.common.Text.Syntax': () => import('../ui/Text.Syntax/TextSyntax.SPEC'),
  'sys.ui.common.Measure': () => import('../ui.tools/Measure/Measure.SPEC'),
  'sys.ui.common.useFocus': () => import('../ui/useFocus/useFocus.SPEC'),
  'sys.ui.common.useSizeObserver': () => import('../ui/useSizeObserver/useSizeObserver.SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner': () => import('../ui.dev/TestRunner/-SPEC.TestRunner'),
  'sys.ui.dev.CmdHost': () => import('../ui.dev/CmdHost/-SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/-SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/-SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/-SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Boolean/-SPEC'),
  'sys.ui.dev.DevTools.Title': () => import('../ui.dev/DevTools.Title/-SPEC'),
  'sys.ui.dev.DevTools.Todo': () => import('../ui.dev/DevTools.Todo/-SPEC'),
};

export const All = {
  ...Specs,
  ...DevSpecs,
};
