import { Stuff } from './Stuff.mjs';
// const Stuff = import('./Stuff.mjs');

// const FooDynamic = import('../foo');
// console.log('FooDynamic', FooDynamic);

/**
 * Workers
 * https://vitejs.dev/guide/features.html#web-workers
 */

export const Name = '💦  My Worker';

console.log('Web.Worker.mts', Name);
console.log('Stuff', Stuff);

export default { Name };
