import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';
import { DevReload } from '../ui.Dev.Reload';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  DevReload: typeof DevReload;
};
export const DevDelete = FC.decorate<t.DevDeleteProps, Fields>(
  View,
  { DEFAULTS, DevReload },
  { displayName: DEFAULTS.displayName },
);
