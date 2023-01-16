export * from '../common';

export const BUTTON_COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  RED: '#EC4838',
} as const;

export const transition = {
  type: 'tween',
  easing: 'easeInOut',
  duration: 0.25,
} as const;
