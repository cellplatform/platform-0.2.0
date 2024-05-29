import { invoke } from '@tauri-apps/api/tauri';

/**
 * Generated from:
 *    yarn create tauri-app
 *
 * Options:
 *    - yarn
 *    - vanilla
 *    - typescript
 */
let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    /**
     * Learn more about Tauri commands at
     * https://tauri.app/v1/guides/features/command
     */
    const name = greetInputEl.value;
    greetMsgEl.textContent = await invoke('greet', { name });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  greetInputEl = document.querySelector('#greet-input');
  greetMsgEl = document.querySelector('#greet-msg');
  document.querySelector('#greet-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    greet();
  });
});
