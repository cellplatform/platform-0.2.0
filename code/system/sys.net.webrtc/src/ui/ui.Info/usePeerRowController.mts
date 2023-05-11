import { t } from './common';

/**
 * Controller for a single peer.
 */
export function usePeerRowController(args: { enabled?: boolean }) {
  const { enabled = true } = args;

  /**
   * TODO 🐷
   */
  console.log('usePeerRowController', args);

  return { enabled };
}
