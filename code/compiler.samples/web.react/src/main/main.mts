import { rx, slug, t, Time, WorkerBus } from './common/index.mjs';
import workerUrl from './worker.mjs?worker&url';

const workerbus = rx.bus<t.NetworkMessageEvent>();

/**
 * Sample worker instantiation.
 */
const workerId = `worker.${slug()}`;
const worker = new Worker(workerUrl, { type: 'module', name: workerId });

const bus = rx.bus();
const pump = WorkerBus.Pump.main({ worker, bus });
bus.$.subscribe((e) => console.info(`🌼 bus:`, e.payload));

/**
 * Log worker init.
 */
console.group('🌼 main');
console.info(`- bus:`, workerbus);
console.info(`- pump:`, pump);
console.info('- workerId:', workerId);
console.info('- workerUrl:', workerUrl);
console.info('- worker instance: ', worker);
console.groupEnd();

/**
 * Dispatch sample event.
 */

Time.delay(800, () => {
  pump.fire(
    {
      type: 'main/foo',
      payload: { count: 123 },
    },
    { target: workerId },
  );
});
