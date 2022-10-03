import { WorkerBus } from 'sys.net';
import { rx } from 'sys.util';
import { WorkerGlobal } from 'sys.types';
import * as t from './common/types.mjs';

const ctx: WorkerGlobal = self as any;

const bus = rx.bus();
const pump = WorkerBus.Pump.worker({ ctx, bus });

bus.$.subscribe((e) => {
  console.info(`💦 bus:`, e.payload);
});

/**
 * Log worker init.
 */
console.group('💦 worker');
console.info('- pump:', pump);
console.info(`- localbus:`, bus);
console.info('- self:', self);
console.groupEnd();

pump.fire({
  type: 'foo',
  payload: { msg: `Hello from "${pump.id}" 💦` },
});
