import { Bus } from './BusController';
import { Filesize } from './common';
import { Path } from './Path';

export const Filesystem = {
  Bus,
  Path,
  Filesize,
} as const;
