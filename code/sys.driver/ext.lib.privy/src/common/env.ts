import type * as t from './t';

const env = (key: t.AuthEnvKey): string => {
  const obj = (import.meta as any).env;
  const value = obj[key];
  if (!value) throw new Error(`Failed to retrieve '${key}'. Ensure a .env.local file exists.`);
  return value;
};

export const AuthEnv = {
  provider: {
    appId: env('VITE_PUBLIC_PRIVY_APP_ID'),
    walletConnectId: env('VITE_WALLET_CONNECT_PROJECT_ID'),
  },
} as const;
