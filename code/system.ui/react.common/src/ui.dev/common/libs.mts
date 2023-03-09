/**
 * @system
 */
export { Spec } from 'sys.ui.react.dev';
export { Tree } from 'sys.test.spec';

/**
 * HACK:
 *   Dynamic import prevents a circular dependency error where the
 *   module is not retrieved.  This happens because the 'vite-plugin-top-level-await'
 *   build plubic is used (which is a dependency of Automerge).
 *
 *   For more context see: https://github.com/Menci/vite-plugin-top-level-await
 */
export const {
  Dev: DevBase,
  ValueHandler,
  DevWrangle,
  DevKeyboard,
} = await import('sys.ui.react.dev');

/**
 * @local
 */
export { DevIcons as Icons, Icon } from '../Icons.mjs';
export { ObjectView } from '../../ui/ObjectView';
export { Button } from '../../ui/Button';
export { Switch } from '../../ui/Button.Switch';
export { RenderCount } from '../../ui/RenderCount';
