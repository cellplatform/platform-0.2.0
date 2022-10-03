import { getVersion } from '@tauri-apps/api/app';

import { appWindow } from '@tauri-apps/api/window';

(async () => {
  const version = await getVersion();
  appWindow.setTitle(`A1 - ${version}`);
})();
