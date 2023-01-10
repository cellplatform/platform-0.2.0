import { Dev as Base } from './libs.mjs';
import { DevTools as Tools } from './DevTools';
import { LocalStorage } from '../tools';

const { init: tools } = Tools;
const { describe, ctx, once } = Base.Spec;

export const Dev = {
  ...Base,
  Tools,
  LocalStorage,

  tools,
  describe,
  ctx,
  once,
};
