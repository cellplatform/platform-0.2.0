import { JsonBus as Bus } from '../Json.Bus';
import { Patch } from '../Json.Patch';
import { PatchState } from '../Json.PatchState';
import { JsonPath as Path } from '../Json.Path';
import { Is, Json as JsonUtil } from '../common';

export const Json = {
  Bus,
  Patch,
  PatchState,
  Path,

  isJson: Is.json,
  stringify: JsonUtil.stringify,
} as const;
