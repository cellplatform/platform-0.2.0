import { Keyboard as Base } from 'sys.ui.dom';

export const Keyboard = {
  ...Base,
  ui: { EventProps: () => import('./ui.EventProps') },
};
