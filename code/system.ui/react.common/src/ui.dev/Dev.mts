import { Dev as Base, LocalStorage } from './common';
import { DevTools as Tools, Helpers } from './DevTools';
import { ObjectView } from '../ui/ObjectView';
import { Lorem } from '../ui.tools';

const { init: tools } = Tools;
const { describe, ctx } = Base.Spec;

export const Dev = {
  ...Base,
  ...Helpers,

  Tools,
  LocalStorage,
  ObjectView,
  Lorem,

  tools,
  describe,
  ctx,
};
