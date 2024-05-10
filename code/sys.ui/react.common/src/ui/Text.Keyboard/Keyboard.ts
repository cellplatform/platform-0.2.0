import { Keyboard as Base } from 'sys.ui.dom';
import { useKeyboardState } from './useKeyboardState';

export const Keyboard = {
  ...Base,
  EventProps: () => import('./ui.EventProps'),
  useKeyboardState,
} as const;
