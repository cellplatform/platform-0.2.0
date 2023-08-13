import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

const params = new URL(location.href).searchParams;
const isDev = params.has('dev') || params.has('d');
const badge = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml',
};

/**
 * User Interface
 */
type SubjectMatter = 'Dev' | 'DefaultEntry';

const render = async (subject: SubjectMatter) => {
  const root = createRoot(document.getElementById('root')!);

  if (subject === 'Dev') {
    const { Dev } = await import('sys.ui.react.common');
    const { Specs } = await import('./entry.Specs.mjs');
    const el = await Dev.render(Pkg, Specs, { badge, hrDepth: 3 });
    root.render(el);
    return;
  }

  if (subject === 'DefaultEntry') {
    const { Dev } = await import('sys.ui.react.common');

    const version = Pkg.toString();
    const width = 200;
    const style = { width, borderRadius: 200, useSelect: 'none' };
    const url = 'https://euc.li/jamesamuel.eth';
    const el = (
      <Dev.Splash footer={version}>
        <img src={url} style={style} />
      </Dev.Splash>
    );

    root.render(el);
    return;
  }
};

/**
 * ENTRY
 */
if (isDev) render('Dev');
if (!isDev) render('DefaultEntry');
