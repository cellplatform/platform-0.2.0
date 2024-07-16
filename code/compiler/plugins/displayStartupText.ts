import type { PluginOption } from 'vite';

/**
 * Display a console output during startup
 */
export function displayStartupText(text: string): PluginOption {
  let hmrCount = 0;
  return {
    name: 'display-startup-text',
    config(config, env) {
      console.info(text);
    },
    handleHotUpdate(e) {
      hmrCount++;
    },
  };
}
