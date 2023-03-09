import { Lorem } from '../../ui.tools';
import { ObjectView } from '../../ui/ObjectView';
import { DevBase, LocalStorage, Value } from '../common';
import { DevTools, Helpers } from '../DevTools';
import { TestRunner } from '../TestRunner';

const { describe, ctx } = DevBase.Spec;
const { trimStringsDeep } = Value.object;

export const Dev = {
  ...DevBase,
  ...Helpers,

  Tools: DevTools,
  tools: DevTools.init,

  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,

  ctx,
  describe,

  trimStringsDeep,
};
