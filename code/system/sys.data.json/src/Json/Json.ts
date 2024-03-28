import { Patch } from '../Json.Patch';
import { PatchState } from '../Json.PatchState';
import { Is, ObjectPath as Path, Json as Util } from '../common';

export const Json = {
  Patch,
  PatchState,
  Path,
  isJson: Is.json,
  stringify: Util.stringify,
} as const;
