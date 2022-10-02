import { rx, slug, t, Time } from '../common/index.mjs';
import workerUrl from './Worker.mjs?worker&url';

const id = 'Main';
const workerbus = rx.bus<t.NetworkMessageEvent>();

/**
 * Sample worker (instance).
 */
const workerId = `worker.${slug()}`;
const worker = new Worker(workerUrl, { type: 'module', name: workerId });

console.group('🌼 main');
console.info(`- bus:`, workerbus);
console.info('- workerId:', workerId);
console.info('- workerUrl:', workerUrl);
console.info('- worker instance: ', worker);
console.groupEnd();

worker.onmessage = (e: MessageEvent) => console.info('🌼 from worker:', e.data);

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
