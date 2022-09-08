import { Path, Filesize, BusController, BusEvents } from 'sys.fs';

export const Filesystem = {
  Path,
  Filesize,
  driver: {
    kind: 'Node',
    BusController,
    BusEvents,
  },
};
