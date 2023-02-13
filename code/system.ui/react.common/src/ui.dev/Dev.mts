import { DevTools, Helpers } from './DevTools';
import { Lorem } from '../ui.tools';
import { ObjectView as Object } from '../ui/ObjectView';
import { LocalStorage, DevBase } from './common';
import { TestRunner } from './TestRunner';
import { init as tools } from './DevTools/DevTools.init';

const { describe, ctx } = DevBase.Spec;

export const Dev = {
  ...DevBase,
  ...Helpers,

  Tools: DevTools,
  TestRunner,
  LocalStorage,
  Object,
  Lorem,

  ctx,
  describe,
  tools,
};
