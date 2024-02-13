import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

export const ModuleSpecs = {
  [`${ns}.Button`]: () => import('../ui/Button/-SPEC'),
  [`${ns}.Button.Copy`]: () => import('../ui/Button/-SPEC.CopyButton'),
  [`${ns}.Button.Switch`]: () => import('../ui/Button.Switch/-SPEC'),
  [`${ns}.Card`]: () => import('../ui/Card/-SPEC'),
  [`${ns}.Center`]: () => import('../ui/Center/-SPEC'),
  [`${ns}.Chip`]: () => import('../ui/Chip/-SPEC'),
  [`${ns}.Command.Bar`]: () => import('../ui/Command.Bar/-SPEC'),
  [`${ns}.ContainerQuery`]: () => import('../ui/ContainerQuery/-SPEC'),
  [`${ns}.EdgePosition`]: () => import('../ui/EdgePosition/-SPEC'),
  [`${ns}.EdgePosition.Selector`]: () => import('../ui/EdgePosition.Selector/-SPEC'),
  [`${ns}.Flip`]: () => import('../ui/Flip/-SPEC'),
  [`${ns}.Grid`]: () => import('../ui/Grid/-dev/-SPEC'),
  [`${ns}.Icon`]: () => import('../ui/Icon/-SPEC'),
  [`${ns}.IFrame`]: () => import('../ui/IFrame/-SPEC'),
  [`${ns}.LabelItem`]: () => import('../ui/LabelItem/-dev/-SPEC'),
  [`${ns}.LabelItem.Stateful`]: () => import('../ui/LabelItem.Stateful/-dev/-SPEC'),
  [`${ns}.LabelItem.VirtualList`]: () => import('../ui/LabelItem.VirtualList/-SPEC'),
  [`${ns}.Layout.Split`]: () => import('../ui/Layout.Split/-SPEC'),
  [`${ns}.Measure`]: () => import('../ui.tools/Measure/-SPEC'),
  [`${ns}.Module.Loader`]: () => import('../ui/Module.Loader/-SPEC'),
  [`${ns}.Module.Loader.Stateful`]: () => import('../ui/Module.Loader/-SPEC.Stateful'),
  [`${ns}.Module.Namespace`]: () => import('../ui/Module.Namespace/-SPEC'),
  [`${ns}.Module.Namespace.List`]: () => import('../ui/Module.Namespace/-SPEC.List'),
  [`${ns}.RenderCount`]: () => import('../ui/RenderCount/-SPEC'),
  [`${ns}.ProgressBar`]: () => import('../ui/ProgressBar/-SPEC'),
  [`${ns}.PropList`]: () => import('../ui/PropList/-dev/-SPEC'),
  [`${ns}.PropList.FieldSelector`]: () => import('../ui/PropList.FieldSelector/-dev/-SPEC'),
  [`${ns}.ObjectView`]: () => import('../ui/ObjectView/-SPEC'),
  [`${ns}.QRCode`]: () => import('../ui/QRCode/-SPEC'),
  [`${ns}.Slider`]: () => import('../ui/Slider/-SPEC'),
  [`${ns}.Spinner`]: () => import('../ui/Spinner/-SPEC'),
  [`${ns}.Text`]: () => import('../ui/Text/-dev/-SPEC'),
  [`${ns}.Text.Font`]: () => import('../ui/Text.Font/-SPEC'),
  [`${ns}.Text.Input`]: () => import('../ui/Text.Input/-dev/-SPEC'),
  [`${ns}.Text.Keyboard`]: () => import('../ui/Text.Keyboard/-dev/-SPEC'),
  [`${ns}.Text.Secret`]: () => import('../ui/Text.Secret/-SPEC'),
  [`${ns}.Text.Syntax`]: () => import('../ui/Text.Syntax/-SPEC'),
};

export const HookSpecs = {
  [`${ns}.useFocus`]: () => import('../ui/useFocus/-SPEC'),
  [`${ns}.useSizeObserver`]: () => import('../ui/useSizeObserver/-SPEC'),
  [`${ns}.useDragTarget`]: () => import('../ui/useDragTarget/-dev/-SPEC'),
  [`${ns}.useMouse`]: () => import('../ui/use/-SPEC.useMouse'),
};

export const DevSpecs = {
  [`sys.ui.dev.TestRunner.Results`]: () => import('../ui.dev/TestRunner/-dev/-SPEC.Results'),
  [`sys.ui.dev.TestRunner.PropList`]: () => import('../ui.dev/TestRunner/-dev/-SPEC.PropList'),
  'sys.ui.dev.TestRunner.PropList.runner': () =>
    import('../ui.dev/TestRunner/-dev/-SPEC.PropList.runner'),
  [`sys.ui.dev.CmdHost`]: () => import('../ui.dev/Dev.CmdHost/-SPEC'),
  [`sys.ui.dev.ModuleList`]: () => import('../ui.dev/-SPEC/-SPEC.ModuleList'),
  [`sys.ui.dev.DevSplash`]: () => import('../ui.dev/Dev.Splash/-SPEC'),
  [`sys.ui.dev.DevTools`]: () => import('../ui.dev/DevTools/-SPEC'),
  [`sys.ui.dev.DevTools.Hr`]: () => import('../ui.dev/DevTools.Hr/-SPEC'),
  [`sys.ui.dev.DevTools.Button`]: () => import('../ui.dev/DevTools.Button/-SPEC'),
  [`sys.ui.dev.DevTools.Boolean`]: () => import('../ui.dev/DevTools.Boolean/-SPEC'),
  [`sys.ui.dev.DevTools.Textbox`]: () => import('../ui.dev/DevTools.Textbox/-SPEC'),
  [`sys.ui.dev.DevTools.Bdd`]: () => import('../ui.dev/DevTools.Bdd/-SPEC'),
  [`sys.ui.dev.DevTools.Title`]: () => import('../ui.dev/DevTools.Title/-SPEC'),
  [`sys.ui.dev.DevTools.Todo`]: () => import('../ui.dev/DevTools.Todo/-SPEC'),
};

export const SampleSpecs = {
  [`sys.ui.sample.Hash`]: () => import('../ui.sample/Hash/-SPEC'),
  [`sys.ui.sample.Signals`]: () => import('../ui.sample/Signals/-SPEC'),
};

export const Specs = {
  ...ModuleSpecs,
  ...HookSpecs,
  ...DevSpecs,
  ...SampleSpecs,
};

export default Specs;
