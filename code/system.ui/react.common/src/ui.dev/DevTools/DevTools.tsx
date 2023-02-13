import { boolean } from '../DevTools.Boolean';
import { button } from '../DevTools.Button';
import { hr } from '../DevTools.Hr';
import { title } from '../DevTools.Title';
import { todo } from '../DevTools.Todo';
import { init } from './DevTools.init';

export const DevTools = {
  /**
   * Curried initializtation.
   */
  init,

  /**
   * Widgets.
   */
  button,
  boolean,
  title,
  todo,
  hr,
};
