import { createRoot } from 'react-dom/client';
import { Dev } from '.';

// const spec = import('');
const spec = undefined;

const el = <Dev.Harness spec={spec} style={{ Absolute: 0 }} />;
const root = createRoot(document.getElementById('root')!);
root.render(el);
