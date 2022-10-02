import { rx, slug, t, Time } from './common/index.mjs';
import workerUrl from './Worker.mjs?worker&url';

import type { NetworkMessage, NetworkMessageEvent } from './types.mjs';

// import { WorkerTransport } from './WorkerTransport.mjs';

const id = 'Main';
const workerbus = rx.bus<NetworkMessageEvent>();
// const fireToWorker = (e: t.Event) => worker.postMessage({ source: 'main', ...e });

/**
 * Sample worker instantiation.
 */
const workerId = `worker.${slug()}`;
const worker = new Worker(workerUrl, { type: 'module', name: workerId });

// worker.onmessage

// const transport = rx.WorkerTransport({ ctx: worker, bus });

/**
 * Log worker init.
 */
console.group('🌼 main');
console.info(`- bus:`, workerbus);
console.info('- workerId:', workerId);
console.info('- workerUrl:', workerUrl);
console.info('- worker instance: ', worker);
console.groupEnd();

worker.onmessage = (e: MessageEvent) => console.info('🌼 from worker:', e.data);
// setTimeout(() => worker.postMessage({ message: 'Delayed hello from 🌼' }), 700);

// worker.postMessage

/**
 * Dispatch sample event.
 */

let _count = 0;
const fireSample = () => {
  _count++;
  worker.postMessage({
    type: 'Network/message',
    payload: {
      tx: slug(),
      sender: id,
      event: { type: 'foo', payload: { message: 'Hello from Main 🌼', count: _count } },

      // target: 'TMP', // TEMP 🐷
    },
  });
};

Time.delay(800, fireSample);
