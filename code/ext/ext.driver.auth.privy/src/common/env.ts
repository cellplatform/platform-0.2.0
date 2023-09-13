import type * as t from './types';

const get = (key: t.AuthEnvKey): string => {
  const env = (import.meta as any).env;
  const value = env[key];
  if (!value) throw new Error(`Failed to retrieve '${key}'. Ensure a .env.local file exists.`);
  return value;
};

export const AuthEnv = {
  provider: {
    appId: get('VITE_PUBLIC_PRIVY_APP_ID'),
    walletConnectId: get('VITE_WALLET_CONNECT_PROJECT_ID'),
  },
} as const;
