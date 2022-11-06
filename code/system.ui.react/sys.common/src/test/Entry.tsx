import { createRoot } from 'react-dom/client';
import { Pkg } from '../common.mjs';

/**
 * User Interface
 */
const el = <div>Hello {Pkg.toString()}</div>;
const root = createRoot(document.getElementById('root')!);
root.render(el);
