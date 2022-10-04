import { getVersion } from '@tauri-apps/api/app';
import { createRoot } from 'react-dom/client';

/**
 * Render
 */
(async () => {
  const root = createRoot(document.getElementById('root')!);

  const withinTauri = Boolean((window as any).__TAURI_IPC__);

  if (withinTauri) {
    import('./main/index.mjs');
    const { App } = await import('./ui/App/index.mjs');
    root.render(<App version={await getVersion()} />);
  }

  if (!withinTauri) {
    const { NotWithinTauri } = await import('./ui/NotWithinTauri');
    root.render(<NotWithinTauri />);
  }
})();
