import { Patch } from '../Json.Patch';
import { PatchState } from '../Json.PatchState';
import { Path } from '../Json.Path';
import { Is, Json as Util } from '../common';

export const Json = {
  Patch,
  PatchState,
  Path,
  isJson: Is.json,
  stringify: Util.stringify,
} as const;
