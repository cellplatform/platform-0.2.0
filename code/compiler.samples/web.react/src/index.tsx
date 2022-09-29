import { createRoot } from 'react-dom/client';

import { Foo } from './Foo';
import('./main.mjs');

/**
 * User Interface
 */
const root = createRoot(document.getElementById('root')!);
root.render(<Foo />);
