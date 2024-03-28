import 'symbol-observable';

import { createRoot } from 'react-dom/client';
import { RootHolding } from '.';

/**
 * User Interface
 */
const el = <RootHolding />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
