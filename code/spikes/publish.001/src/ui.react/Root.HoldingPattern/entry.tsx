import 'symbol-observable'; // Ponyfill observable symbols.
import { createRoot } from 'react-dom/client';
import { RootHolding } from './index.mjs';

/**
 * User Interface
 */
const el = <RootHolding />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
