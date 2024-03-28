import type { t } from './common';
import { Pkg } from '../index.pkg.mjs';
export { Pkg };
const ns = Pkg.name;

const importCommon = async () => {
  const { dev } = await import('sys.ui.react.common');
  const { Specs } = await dev();
  return {
    'sys.ui.common.Grid': Specs['sys.ui.common.Grid'],
    'sys.ui.common.Item.LabelItem': Specs['sys.ui.common.LabelItem'],
    'sys.ui.common.Item.LabelItem.Stateful': Specs['sys.ui.common.LabelItem.Stateful'],
    'sys.ui.common.EdgePosition': Specs['sys.ui.common.EdgePosition'],
    'sys.ui.common.EdgePosition.Selector': Specs['sys.ui.common.EdgePosition.Selector'],
  } as t.SpecImports;
};

const importConcept = async () => {
  const { dev } = await import('sys.ui.react.concept');
  const { Specs } = await dev();
  return Specs;
};

export const Specs = {
  // SLC ("Social Lean Canvas")
  [`${ns}.tests`]: () => import('./-TestRunner'),
  [`${ns}.ui.Info`]: () => import('../ui/slc.Info/-dev/-SPEC'),
  [`${ns}.ui.IFrameRef`]: () => import('../ui/slc.IFrameRef/-SPEC'),

  // System
  [`${ns}.ui.Payment.Stripe`]: () => import('../ui/ext.ui.Payment.Stripe/-SPEC'),

  // External (Partitions).
  [`${ns}.ext.Ember`]: () => import('../ui/ext.slc.Ember/-SPEC'),

  // system
  ...(await importCommon()),
  ...(await importConcept()),
} as t.SpecImports;

export default Specs;
