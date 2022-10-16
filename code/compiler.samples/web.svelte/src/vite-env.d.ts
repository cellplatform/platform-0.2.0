/// <reference types="svelte" />
/// <reference types="vite/client" />

/**
 * Ref: https://stackoverflow.com/a/73026268
 * What:
 *    Ensure [import] statements from './file.svelte' paths do not
 *    incorrectly throw error wanings (red lines).
 */
declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}
