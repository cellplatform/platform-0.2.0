import { Dev as Base } from './libs.mjs';
import { DevTools as Tools } from './DevTools';
import { LocalStorage } from '../tools';
import { ObjectView } from '../ui/ObjectView';

const { init: tools } = Tools;
const { describe, ctx, once } = Base.Spec;

export const Dev = {
  ...Base,
  Tools,
  LocalStorage,
  ObjectView,

  tools,
  describe,
  ctx,
  once,
};
