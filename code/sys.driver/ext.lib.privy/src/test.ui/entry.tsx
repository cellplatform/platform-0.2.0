import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from 'sys.ui.react.common';
import { Pkg } from '../index.pkg';

const url = new URL(location.href);
const isLocalhost = url.hostname === 'localhost' && url.port !== '3000'; // NB: 3000 is the built sample port

async function importSpecs() {
  if (isLocalhost) {
    return import('./entry.Specs.Localhost');
  } else {
    return import('./entry.Specs');
  }
}

(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await importSpecs();

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
