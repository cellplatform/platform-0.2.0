import { getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import('./worker.main.mjs');

(async () => {
  const version = await getVersion();
  appWindow.setTitle(`A1 - ${version}`);
})();
