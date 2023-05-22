import { Keyboard as Base } from 'sys.ui.dom';
import { useKeyboardState } from './useKeyboardState.mjs';

export const Keyboard = {
  ...Base,
  EventProps: () => import('./ui.EventProps'),
  useKeyboardState,
};
