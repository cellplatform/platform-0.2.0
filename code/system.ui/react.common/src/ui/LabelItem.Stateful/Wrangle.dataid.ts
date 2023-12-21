import { type t } from './common';

/**
 * Helpers
 */
export const dataid = {
  item(instanceid?: string) {
    return `ListItem:${instanceid || 'unknown'}`;
  },
};
