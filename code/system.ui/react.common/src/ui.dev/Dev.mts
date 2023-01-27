import { Lorem } from '../ui.tools';
import { ObjectView as Object } from '../ui/ObjectView';
import { Dev as Base, LocalStorage } from './common';
import { DevTools as Tools, Helpers } from './DevTools';
import { TestRunner } from './TestRunner';

const { describe, ctx } = Base.Spec;

export const Dev = {
  ...Base,
  ...Helpers,

  Tools,
  TestRunner,
  LocalStorage,
  Object,
  Lorem,

  ctx,
  describe,
  tools: Tools.init,
};
