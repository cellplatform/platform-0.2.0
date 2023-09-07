export { TestFilesystem } from 'sys.fs.indexeddb';
export { expect, expectError } from 'sys.test';
export { Test, Tree } from 'sys.test.spec';
export { Dev } from 'sys.ui.react.common';

export * from '../ui/common';

/**
 * Constants
 */
const env = (import.meta as any).env;
export const appId = env.VITE_PUBLIC_PRIVY_APP_ID;
export const walletConnectId = env.VITE_WALLET_CONNECT_PROJECT_ID;
