import { DEFAULTS, FC, type t } from './common';

import { peer } from './Root.peer.mjs';
import { Connect as View } from './ui.Connect';
import { Stateful } from './ui.Stateful';
import { useController } from './use.mjs';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  useController: typeof useController;
  peer: typeof peer;
};

export const Connect = FC.decorate<t.ConnectProps, Fields>(
  View,
  { DEFAULTS, Stateful, useController, peer },
  { displayName: 'Connect' },
);
