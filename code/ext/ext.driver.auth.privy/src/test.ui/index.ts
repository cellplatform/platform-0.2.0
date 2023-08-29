export * from './common';

const env = (import.meta as any).env;
export const appId = env.VITE_PUBLIC_PRIVY_APP_ID;
export const walletConnectId = env.VITE_WALLET_CONNECT_PROJECT_ID;
