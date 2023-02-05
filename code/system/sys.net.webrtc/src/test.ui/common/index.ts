/**
 * @system
 */
export {
  css,
  Color,
  COLORS,
  rx,
  Dev,
  IFrame,
  TextInput,
  TextSyntax,
  Button,
} from 'sys.ui.react.common';

export { RecordButton } from 'sys.ui.react.video';

/**
 * @local
 */
export * from '../../common';
export { Icons } from './Icons.mjs';

/**
 * Test Constants
 */
export const TEST = {
  /**
   * WebRTC "signal server" connection coordinating end-point.
   */
  signal: 'rtc.cellfs.com',
} as const;

export type { t } from '../common.t';
