import { rx, slug, t } from './common/index.mjs';
import workerUrl from './Worker.mjs?worker&url';

const bus = rx.bus();
const fireToWorker = (e: t.Event) => worker.postMessage({ source: 'main', ...e });

/**
 * Sample worker instantiation.
 */
const workerId = `worker.${slug()}`;
const worker = new Worker(workerUrl, { type: 'module', name: workerId });

/**
 * Log worker init.
 */
console.group('🌼 main');
console.info(`- bus:`, bus);
console.info('- workerUrl:', workerUrl);
console.info('- worker instance: ', worker);
console.groupEnd();

worker.onmessage = (e: MessageEvent) => console.info('🌼 from worker:', e.data);
setTimeout(
  () => fireToWorker({ type: 'message', payload: { text: 'Delayed hello from 🌼' } }),
  700,
);
