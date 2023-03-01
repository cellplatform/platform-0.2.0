import { DevTools, Helpers } from './DevTools';
import { Lorem } from '../ui.tools';
import { ObjectView } from '../ui/ObjectView';
import { LocalStorage, DevBase, Value } from './common';
import { TestRunner } from './TestRunner';
import { init as tools } from './DevTools/DevTools.init';

const { describe, ctx } = DevBase.Spec;
const { trimStringsDeep } = Value.object;

export const Dev = {
  ...DevBase,
  ...Helpers,

  Tools: DevTools,
  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,

  ctx,
  describe,
  tools,

  trimStringsDeep,
};
