import { JsonBus as Bus } from '../Json.Bus/index.mjs';
import { Patch } from '../Json.Patch/index.mjs';
import { Json as JsonUtil, Is } from '../common/index.mjs';

export const Json = {
  Bus,
  Patch,
  isJson: Is.json,
  stringify: JsonUtil.stringify,
};
