import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { View } from './ui';
import { CmdHostStateful as Stateful } from './Root.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
};
export const CmdHost = FC.decorate<t.CmdHostProps, Fields>(
  View,
  { DEFAULTS, Stateful },
  { displayName: 'CmdHost' },
);
