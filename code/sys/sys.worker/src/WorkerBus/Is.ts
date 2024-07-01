import { rx, type t } from '../common';

/**
 * Boolean checks (flags).
 */
export const Is = {
  /**
   * Determine object is the [main] window thread.
   */
  main(self: any) {
    return self.window === self && self.document;
  },

  /**
   * Determines if the object is a [WebWorker] thread.
   */
  worker(self: any) {
    return self.self === self && !self.window;
  },

  /**
   * Determines if the object is a network message event.
   */
  messageEvent(data: any) {
    const type: t.NetworkMessageEvent['type'] = 'sys.net/msg';
    if (typeof data !== 'object') return false;
    if (data.type !== type) return false;
    if (typeof data.payload.sender !== 'string') return false;
    if (typeof data.payload.tx !== 'string') return false;
    return rx.isEvent(data.payload.event);
  },
};
