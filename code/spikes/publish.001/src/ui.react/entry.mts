const url = new URL(location.href);
const path = url.pathname;

/**
 * 🐷 HACK
 */
if (path.startsWith('/web3/')) {
  import('./Root/entry');
} else {
  import('./Root.Holding/entry');
}
