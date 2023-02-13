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
export const DevBase = (await import('sys.ui.react.dev')).Dev;
