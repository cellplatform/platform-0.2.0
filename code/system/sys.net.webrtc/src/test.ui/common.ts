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
export type { t } from './common.t';

export * from '../common';
export { Icons } from './Icons.mjs';

/**
 * Test constants
 */
export const TEST = {
  signal: 'rtc.cellfs.com', // WebRTC "signal server" connection coordination end-point.
} as const;
