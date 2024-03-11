import { type t } from '../common';

/**
 * In-memory simulation of the WebWorker API for testing code
 * that runs across worker threads.
 */
export function WorkerMemoryStub() {
  type W = { name: string; self: t.WorkerSelf; instance: t.WorkerInstance };
  const workers: W[] = [];

  const api = {
    /**
     * List of stub workers that have been created.
     */
    get workers() {
      return [...workers];
    },

    /**
     * Create a simulated worker instance (from Main).
     */
    worker(name: string, implementation: (self: t.WorkerSelf) => any) {
      const listeners: EventListener[] = [];

      // The "self" context within the web-worker.
      const self: t.WorkerSelf = {
        name,
        addEventListener(type: 'message', listener: EventListener) {
          listeners.push(listener);
        },
        postMessage(data: any) {
          if (!instance.onmessage) return;
          instance.onmessage.call(instance as any, toMessageEvent(data));
        },
      };

      (self as any).self = self; // NB: A charachteristic used to test whether this is a Worker context.
      (self as any).window = undefined;

      // The instance as seen on [Main] window.
      const instance: t.WorkerInstance = {
        onmessage: null,
        postMessage(data: any) {
          listeners.forEach((fn) => fn.call(self, toMessageEvent(data)));
        },
      };

      workers.push({ name, self, instance });
      implementation(self);
      return instance;
    },
  };

  return api;
}

/**
 * [Helpers]
 */
function toMessageEvent(data: any) {
  if (typeof data === 'object' && data !== null) data = { ...data };
  return { data } as MessageEvent;
}

/**
 * Export
 */
export default WorkerMemoryStub;
