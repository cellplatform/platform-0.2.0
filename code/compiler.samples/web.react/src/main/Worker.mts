// import { rx, t } from './common/index.mjs';
import { rx } from 'sys.util';
import type { WorkerGlobalScope } from 'sys.types';

const ctx: WorkerGlobalScope = self as any;

const id = ctx.name;
console.log('id', id);

// ctx.

const l = location;

const localbus = rx.bus();
const pump = rx.pump.create(localbus);

// bus.$.subscribe((e) => {
//   console.info(`💦`, e.payload);
// });

/**
 * Log worker init.
 */
console.group('💦 worker');
console.info('- pump:', pump);
console.info(`- localbus:`, localbus);
console.info('- self:', self);
console.groupEnd();

// IO:n | Respond to message from parent thread.
ctx.addEventListener('message', (e) => console.info('💦 from main:', e.data));

// IO:Out | Post data to parent thread.
ctx.postMessage({ msg: 'Hello from 💦' });

/**
 * Bus Hookup
 */
// ctx.addEventListener('message', (e) => {
//   const data = e.data ?? {};
//   if (typeof data.type === 'string' && typeof data.payload === 'object') {
//     const { type, payload } = data;
//     bus.fire({ type, payload });
//   }
// });
