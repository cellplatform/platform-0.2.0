import 'symbol-observable'; // Ponyfill observable symbols Rxjs looks for.

import { createRoot } from 'react-dom/client';
import { Root } from './Root';

/**
 * User Interface
 */
const el = <Root />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
