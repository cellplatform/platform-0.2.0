export {};
import { rx } from 'sys.util';

const bus = rx.bus();

/**
 * Log worker init.
 */
console.group('💦 worker');
console.log(`worker bus:`, bus);
console.log('self', self);
console.groupEnd();
