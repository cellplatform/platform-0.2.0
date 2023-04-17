import { Lorem } from '../../ui.tools';
import { ObjectView } from '../../ui/ObjectView';
import { Test, DevBase, LocalStorage, Value, DEFAULTS } from '../common';
import { DevTools, Helpers } from '../DevTools';
import { TestRunner } from '../TestRunner';
import { render } from './Dev.render';
import { DevHome as Home } from '../DevHome';
const { describe, ctx } = DevBase.Spec;
const { trimStringsDeep } = Value.object;
const qs = DEFAULTS.qs;

export const Dev = {
  ...DevBase,
  ...Helpers,
  render,

  Tools: DevTools,
  tools: DevTools.init,
  bundle: Test.bundle,

  Home,
  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,
  Url: { qs },

  ctx,
  describe,
  trimStringsDeep,
};
