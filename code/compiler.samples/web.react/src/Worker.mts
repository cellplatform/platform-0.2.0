export {};
import { rx } from 'sys.util';

const ctx: Worker = self as any;

const bus = rx.bus();

/**
 * Log worker init.
 */
console.group('💦 worker');
console.log(`worker bus:`, bus);
console.log('self', self);
console.groupEnd();

// Post data to parent thread.
ctx.postMessage({ msg: 'Hello from 💦' });

// Respond to message from parent thread.
ctx.addEventListener('message', (e) => console.log('💦 from main:', e.data));
