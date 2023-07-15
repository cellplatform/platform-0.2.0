import { JsonBus as Bus } from '../Json.Bus';
import { Patch } from '../Json.Patch';
import { PatchState } from '../Json.PatchState';
import { Is, Json as JsonUtil } from '../common';

export const Json = {
  Bus,
  Patch,
  PatchState,

  isJson: Is.json,
  stringify: JsonUtil.stringify,
};
