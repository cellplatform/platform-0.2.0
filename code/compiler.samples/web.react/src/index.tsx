import React from 'react';
import { createRoot } from 'react-dom/client';

import { Foo } from './Foo';
import workerUrl from './Worker.mjs?worker&url';

/**
 * Init
 */
const root = createRoot(document.getElementById('root')!);
root.render(<Foo />);

/**
 * Sample worker instantiation.
 */
const worker = new Worker(workerUrl, { type: 'module' });

console.log('-------------------------------------------');
console.log('workerUrl:', workerUrl);
console.log('worker (instance on main): ', worker);
