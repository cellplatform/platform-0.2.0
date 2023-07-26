export { Pkg } from '../index.pkg.mjs';

export const ModuleSpecs = {
  'sys.ui.common.Button': () => import('../ui/Button/-SPEC'),
  'sys.ui.common.Button.Switch': () => import('../ui/Button.Switch/-SPEC'),
  'sys.ui.common.Card': () => import('../ui/Card/-SPEC'),
  'sys.ui.common.ContainerQuery': () => import('../ui/ContainerQuery/-SPEC'),
  'sys.ui.common.Center': () => import('../ui/Center/-SPEC'),
  'sys.ui.common.Chip': () => import('../ui/Chip/-SPEC'),
  'sys.ui.common.Flip': () => import('../ui/Flip/-SPEC'),
  'sys.ui.common.Grid': () => import('../ui/Grid/-SPEC'),
  'sys.ui.common.Icon': () => import('../ui/Icon/-SPEC'),
  'sys.ui.common.IFrame': () => import('../ui/IFrame/-SPEC'),
  'sys.ui.common.Item.LabelItem': () => import('../ui/Item.LabelItem/-dev/-SPEC'),
  'sys.ui.common.Item.LabelItem.Stateful': () => import('../ui/Item.LabelItem.Stateful/-dev/-Spec'),
  'sys.ui.common.LoadPanel': () => import('../ui/LoadPanel/-SPEC'),
  'sys.ui.common.Measure': () => import('../ui.tools/Measure/-SPEC'),
  'sys.ui.common.RenderCount': () => import('../ui/RenderCount/-SPEC'),
  'sys.ui.common.ProgressBar_OLD': () => import('../ui/ProgressBar_OLD/-SPEC'),
  'sys.ui.common.PropList': () => import('../ui/PropList/-dev/-SPEC'),
  'sys.ui.common.PropList.FieldSelector': () => import('../ui/PropList.FieldSelector/-dev/-SPEC'),
  'sys.ui.common.ObjectView': () => import('../ui/ObjectView/-SPEC'),
  'sys.ui.common.QRCode': () => import('../ui/QRCode/-SPEC'),
  'sys.ui.common.Spinner': () => import('../ui/Spinner/-SPEC'),
  'sys.ui.common.Text': () => import('../ui/Text/-dev/-SPEC'),
  'sys.ui.common.Text.Font': () => import('../ui/Text.Font/-SPEC'),
  'sys.ui.common.Text.Input': () => import('../ui/Text.Input/-dev/-SPEC'),
  'sys.ui.common.Text.Keyboard': () => import('../ui/Text.Keyboard/-dev/-SPEC'),
  'sys.ui.common.Text.Secret': () => import('../ui/Text.Secret/-SPEC'),
  'sys.ui.common.Text.Syntax': () => import('../ui/Text.Syntax/-SPEC'),
};

export const HookSpecs = {
  'sys.ui.common.useFocus': () => import('../ui/useFocus/-SPEC'),
  'sys.ui.common.useSizeObserver': () => import('../ui/useSizeObserver/-SPEC'),
  'sys.ui.common.useDragTarget': () => import('../ui/useDragTarget/-dev/-SPEC'),
};

export const DevSpecs = {
  'sys.ui.dev.TestRunner.Results': () => import('../ui.dev/TestRunner/-dev/-SPEC.Results'),
  'sys.ui.dev.TestRunner.PropList': () => import('../ui.dev/TestRunner/-dev/-SPEC.PropList'),
  'sys.ui.dev.TestRunner.PropList.runner': () =>
    import('../ui.dev/TestRunner/-dev/-SPEC.PropList.runner'),
  'sys.ui.dev.CmdHost': () => import('../ui.dev/Dev.CmdHost/-SPEC'),
  'sys.ui.dev.DevSplash': () => import('../ui.dev/Dev.Splash/-SPEC'),
  'sys.ui.dev.DevTools': () => import('../ui.dev/DevTools/-SPEC'),
  'sys.ui.dev.DevTools.Hr': () => import('../ui.dev/DevTools.Hr/-SPEC'),
  'sys.ui.dev.DevTools.Button': () => import('../ui.dev/DevTools.Button/-SPEC'),
  'sys.ui.dev.DevTools.Boolean': () => import('../ui.dev/DevTools.Boolean/-SPEC'),
  'sys.ui.dev.DevTools.Textbox': () => import('../ui.dev/DevTools.Textbox/-SPEC'),
  'sys.ui.dev.DevTools.Bdd': () => import('../ui.dev/DevTools.Bdd/-SPEC'),
  'sys.ui.dev.DevTools.Title': () => import('../ui.dev/DevTools.Title/-SPEC'),
  'sys.ui.dev.DevTools.Todo': () => import('../ui.dev/DevTools.Todo/-SPEC'),
};

export const Specs = {
  ...ModuleSpecs,
  ...HookSpecs,
  ...DevSpecs,
};

export default Specs;
