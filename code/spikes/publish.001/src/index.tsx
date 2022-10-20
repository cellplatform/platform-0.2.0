import { createRoot } from 'react-dom/client';
import { Root } from './ui/Root/index.mjs';

/**
 * User Interface
 */

const el = <Root />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
