export * from '../common';

/**
 * Constants
 */
const messages = {
  nothingSelected: 'Nothing selected.',
  nothingToDisplay: 'Nothing to display.',
  tooSmall: 'Screen is too small.',
};

export const DEFAULTS = {
  message: messages.nothingSelected,
  messages,
} as const;
