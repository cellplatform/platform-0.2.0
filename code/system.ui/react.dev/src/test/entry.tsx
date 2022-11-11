import { createRoot } from 'react-dom/client';

import { Pkg, Test } from '../common';
import { Harness } from '../ui.Harness';

/**
 * User Interface
 */
// const el = <div>Hello {Pkg.toString()}</div>;
const el = <Harness spec={import('../sample/MyComponent.SPEC')} style={{ Absolute: 0 }} />;
const root = createRoot(document.getElementById('root')!);
root.render(el);

/**
 * Sample
 */

// (async () => {
//   const ctx = { foo: 123 };
//   const spec = await Test.bundle(import('../sample/MyComponent.SPEC.mjs'));
//
//   // spec.it
//
//   const res = await spec.run({ ctx });
//   console.log('r2', res);
//   //
// })();
