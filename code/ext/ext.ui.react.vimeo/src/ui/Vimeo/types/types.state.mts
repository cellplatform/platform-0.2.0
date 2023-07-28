import { type t } from '../common';

type Id = string;
type Seconds = number;

/**
 * Status
 */
export type VimeoStatus = {
  instance: Id;
  video: t.VimeoId;
  action: 'info' | 'loaded' | 'start' | 'update' | 'seek' | 'stop' | 'end';
  duration: Seconds;
  seconds: Seconds;
  percent: number;
  playing: boolean;
  ended: boolean;
};

/**
 * Icon Flags
 */
export const IconFlags: t.VimeoIconFlag[] = ['spinner', 'play', 'pause', 'replay'];
