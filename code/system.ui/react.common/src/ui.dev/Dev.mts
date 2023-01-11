import { Dev as Base, LocalStorage } from './common';
import { DevTools as Tools, DevToolHelpers } from './DevTools';
import { ObjectView } from '../ui/ObjectView';

const { init: tools } = Tools;
const { describe, ctx } = Base.Spec;

export const Dev = {
  ...Base,
  ...DevToolHelpers,

  Tools,
  LocalStorage,
  ObjectView,

  tools,
  describe,
  ctx,
};
