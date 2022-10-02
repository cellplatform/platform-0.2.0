import { WorkerBus } from 'sys.net';
import { rx } from 'sys.util';

import * as t from './types.mjs';

const ctx: t.WorkerGlobal = self as any;
const id = ctx.name;

const bus = rx.bus<t.NetworkMessageEvent>();

bus.$.subscribe((e) => {
  console.info(`💦 bus:`, e.payload);
});

const transport = WorkerBus.Transport({ ctx, bus });
console.log('transport', transport);

/**
 * Log worker init.
 */
console.group('💦 worker');
// console.info('- pump:', pump);
console.info(`- localbus:`, bus);
console.info('- self:', self);
console.groupEnd();

transport.fire({
  type: 'foo',
  payload: { msg: `Hello from "${id}" 💦` },
});
