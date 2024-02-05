import 'symbol-observable';

const url = new URL(location.href);
const params = url.searchParams;
const path = url.pathname;
const isDev = params.has('dev') || params.has('d');

/**
 * Code-split at primary entry point.
 */
if (path.startsWith('/web3/') || isDev) {
  import('./test.ui/entry');
} else {
  import('./ui/Root.HoldingPattern/entry');
}
