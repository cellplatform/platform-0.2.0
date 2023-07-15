import { JsonBus as Bus } from '../Json.Bus/index.mjs';
import { Patch } from '../Json.Patch/index.mjs';
import { PatchState } from '../Json.PatchState';
import { Is, Json as JsonUtil } from '../common/index.mjs';

export const Json = {
  Bus,
  Patch,
  PatchState,

  isJson: Is.json,
  stringify: JsonUtil.stringify,
};
