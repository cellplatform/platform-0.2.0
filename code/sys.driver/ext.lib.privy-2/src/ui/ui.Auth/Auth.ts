import { AuthEnv as Env } from '../common';
import { AuthProvider as Provider } from '../ui.Auth.Provider';
import { Info } from '../ui.Info';

/**
 * Library API.
 */
export const Auth = {
  Env,
  Info,
  Provider,
} as const;
