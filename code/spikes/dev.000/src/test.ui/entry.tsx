import 'symbol-observable';

import { Dev } from 'sys.ui.react.common';
import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

const params = new URL(location.href).searchParams;
const isDev = params.has('dev') || params.has('d');

const BADGE_CI = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml',
};

const Imports = {
  Specs: () => import('./entry.Specs.mjs'),
  DefaultEntry: () => import('../ui/Root'),
  Temp: () => import('../ui/Root.Temp'),
};

/**
 * User Interface
 */
type SubjectMatter = 'Dev' | 'DefaultEntry' | 'Temp';

const render = async (subject: SubjectMatter) => {
  const root = createRoot(document.getElementById('root')!);

  if (subject === 'Dev') {
    const { Specs } = await Imports.Specs();
    const el = await Dev.render(Pkg, Specs, { badge: BADGE_CI, hrDepth: 3 });
    root.render(el);
  }

  if (subject === 'DefaultEntry') {
    const { RootFill } = await import('../ui/Root');
    const el = <RootFill />;
    root.render(el);
  }

  if (subject === 'Temp') {
    const { Temp } = await import('../ui/Root.Temp');
    const el = <Temp />;
    root.render(el);
  }
};

/**
 * ENTRY
 */
(async () => {
  if (isDev) return render('Dev');
  return render('DefaultEntry');
  // return render('Temp');
})();
