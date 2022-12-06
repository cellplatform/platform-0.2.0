import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';

const Imports = {
  'ui.MonacoEditor': () => import('../ui/MonacoEditor/MonacoEditor.SPEC'),
};

(async () => {
  const el = await Dev.render(Pkg, Imports);
  const root = createRoot(document.getElementById('root')!);
  root.render(el);
})();
