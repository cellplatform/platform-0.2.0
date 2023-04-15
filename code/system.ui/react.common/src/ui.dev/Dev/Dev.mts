import { Lorem } from '../../ui.tools';
import { ObjectView } from '../../ui/ObjectView';
import { Test, DevBase, LocalStorage, Value } from '../common';
import { DevTools, Helpers } from '../DevTools';
import { TestRunner } from '../TestRunner';
import { render } from './Dev.render';

const { describe, ctx } = DevBase.Spec;
const { trimStringsDeep } = Value.object;

export const Dev = {
  ...DevBase,
  ...Helpers,
  render,

  Tools: DevTools,
  tools: DevTools.init,
  bundle: Test.bundle,

  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,

  ctx,
  describe,

  trimStringsDeep,
};
