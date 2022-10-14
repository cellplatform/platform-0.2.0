export {};
import { createRoot } from 'react-dom/client';

import { App } from './ui/App';

/**
 * User Interface
 */
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
