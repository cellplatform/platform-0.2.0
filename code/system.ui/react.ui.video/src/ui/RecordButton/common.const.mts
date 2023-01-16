import { t } from '../common.t';

export const RecordButtonStates: t.RecordButtonState[] = [
  'default',
  'recording',
  'paused',
  'dialog',
];

export const TRANSITION = {
  type: 'tween',
  easing: 'easeInOut',
  duration: 0.25,
} as const;
