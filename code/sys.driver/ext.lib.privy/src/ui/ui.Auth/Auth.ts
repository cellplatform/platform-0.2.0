import { AuthProvider as Provider } from './Auth.Provider';
import { Info } from '../ui.Info';
import { AuthEnv as Env } from './common';

/**
 * Library API.
 */
export const Auth = {
  Env,
  Info,
  Provider,
} as const;
