export {};
import { rx } from 'sys.util';

import workerUrl from './Worker.mjs?worker&url';
const bus = rx.bus();

/**
 * Sample worker instantiation.
 */
const worker = new Worker(workerUrl, { type: 'module' });

/**
 * Log worker init.
 */
console.group('🌼 main');
console.log(`main bus:`, bus);
console.log('workerUrl:', workerUrl);
console.log('worker (instance): ', worker);
console.groupEnd();

worker.onmessage = (e: MessageEvent) => console.log('🌼 from worker:', e.data);
setTimeout(() => worker.postMessage({ msg: 'Hello from 🌼' }), 500);
