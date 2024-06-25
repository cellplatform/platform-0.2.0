/**
 * Test Constants
 */
export const DEFAULTS = {
  get signal() {
    return { host: 'rtc.bus.events', path: 'signal', key: 'cell' };
  },
} as const;
