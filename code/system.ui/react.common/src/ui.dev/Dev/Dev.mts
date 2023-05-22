import { Lorem } from '../../ui.tools';
import { ObjectView } from '../../ui/ObjectView';
import { DevSplash as Splash } from '../DevSplash';
import { DevTools, Helpers } from '../DevTools';
import { TestRunner } from '../TestRunner';
import { DEFAULTS, DevBase, LocalStorage, Test, Value } from '../common';
import { render } from './Dev.render';
import { DevIcons as Icons } from '../Icons.mjs';

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

  Icons,
  Splash,
  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,
  Url: { qs },

  ctx,
  describe,
  trimStringsDeep,
};
