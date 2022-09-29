import { createRoot } from 'react-dom/client';

import { App } from './App';
import('./main.mjs');

/**
 * User Interface
 */
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
