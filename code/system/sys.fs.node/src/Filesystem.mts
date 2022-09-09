import { Path, Filesize, BusController, BusEvents } from 'sys.fs';
import { NodeDriver as Node } from './Node.Fs.Driver/index.mjs';

export const Filesystem = {
  Path,
  Filesize,
  Driver: {
    kind: 'Node',
    Node,
    BusController,
    BusEvents,
  },
};
