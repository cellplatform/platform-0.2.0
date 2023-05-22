export const Specs = {
  'sys.ui.common.Button': () => import('../ui/Button/-SPEC'),
  'sys.ui.common.Button.Switch': () => import('../ui/Button.Switch/-SPEC'),
  'sys.ui.common.Card': () => import('../ui/Card/-SPEC'),
  'sys.ui.common.Center': () => import('../ui/Center/-SPEC'),
  'sys.ui.common.Chip': () => import('../ui/Chip/-SPEC'),
  'sys.ui.common.Flip': () => import('../ui/Flip/-SPEC'),
  'sys.ui.common.Icon': () => import('../ui/Icon/-SPEC'),
  'sys.ui.common.IFrame': () => import('../ui/IFrame/-SPEC'),
  'sys.ui.common.LoadPanel': () => import('../ui/LoadPanel/-SPEC'),
  'sys.ui.common.Measure': () => import('../ui.tools/Measure/-SPEC'),
  'sys.ui.common.RenderCount': () => import('../ui/RenderCount/-SPEC'),
  'sys.ui.common.ProgressBar': () => import('../ui/ProgressBar/-SPEC'),
  'sys.ui.common.PropList': () => import('../ui/PropList/-dev/-SPEC'),
  'sys.ui.common.ObjectView': () => import('../ui/ObjectView/-SPEC'),
  'sys.ui.common.QRCode': () => import('../ui/QRCode/-SPEC'),
  'sys.ui.common.Spinner': () => import('../ui/Spinner/-SPEC'),
  'sys.ui.common.Text': () => import('../ui/Text/-SPEC'),
  'sys.ui.common.Text.Font': () => import('../ui/Text.Font/-SPEC'),
  'sys.ui.common.Text.Input': () => import('../ui/Text.Input/-dev/-SPEC'),
  'sys.ui.common.Text.Keyboard': () => import('../ui/Text.Keyboard/-dev/-SPEC'),
  'sys.ui.common.Text.Secret': () => import('../ui/Text.Secret/-SPEC'),
  'sys.ui.common.Text.Syntax': () => import('../ui/Text.Syntax/-SPEC'),
  'sys.ui.common.useFocus': () => import('../ui/useFocus/-SPEC'),
  'sys.ui.common.useSizeObserver': () => import('../ui/useSizeObserver/-SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner': () => import('../ui.dev/TestRunner/-dev/-SPEC.TestRunner'),
  'sys.ui.dev.CmdHost': () => import('../ui.dev/CmdHost/-SPEC'),
  'sys.ui.dev.DevSplash': () => import('../ui.dev/DevSplash/-SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/-SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/-SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/-SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Boolean/-SPEC'),
  'sys.ui.dev.DevTools.Title': () => import('../ui.dev/DevTools.Title/-SPEC'),
  'sys.ui.dev.DevTools.Textbox': () => import('../ui.dev/DevTools.Textbox/-SPEC'),
  'sys.ui.dev.DevTools.Todo': () => import('../ui.dev/DevTools.Todo/-SPEC'),
};

export const All = {
  ...Specs,
  ...DevSpecs,
};
