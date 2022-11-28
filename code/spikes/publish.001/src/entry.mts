import 'symbol-observable';

const url = new URL(location.href);
const path = url.pathname;
const isTauri = typeof (window as any).__TAURI__ === 'object';

/**
 * Code-split at primary entry point.
 */
if (isTauri || path.startsWith('/web3/')) {
  import('./test.ui/entry');
} else {
  import('./ui.react/Root.HoldingPattern/entry');
}
