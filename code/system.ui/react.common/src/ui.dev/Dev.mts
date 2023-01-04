import { Dev as Base } from './libs.mjs';
import { DevTools as Tools } from './DevTools';

const { init: tools } = Tools;
const { describe, ctx, once } = Base.Spec;

export const Dev = {
  ...Base,
  Tools,

  tools,
  describe,
  ctx,
  once,
};
