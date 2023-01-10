import { Dev as Base, LocalStorage } from './common';
import { DevTools as Tools } from './DevTools';
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
