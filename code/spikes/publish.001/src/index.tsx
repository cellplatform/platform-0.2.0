import { createRoot } from 'react-dom/client';
import { App } from './ui/Root/index.mjs';

/**
 * User Interface
 */
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
