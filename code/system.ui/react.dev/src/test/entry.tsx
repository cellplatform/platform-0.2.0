import { createRoot } from 'react-dom/client';
import { Dev } from '../index.mjs';

const spec = import('../sample/MyComponent.SPEC');
const el = <Dev.Harness spec={spec} style={{ Absolute: 0 }} />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
