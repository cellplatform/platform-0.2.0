/**
 * Vercel configuration file ("vercel.json").
 * REF
 *    https://vercel.com/docs/project-configuration
 */
export type VercelConfigFile = {
  regions?: string[];
  public?: boolean;
  cleanUrls?: boolean;
  trailingSlash?: boolean;
  redirects?: VercelConfigRedirect[];
  rewrites?: VercelConfigRewrite[];
  headers?: VercelConfigHeader[];
};
export type VercelConfigRedirect = { source: string; destination: string };
export type VercelConfigRewrite = { source: string; destination: string };

/**
 * Vercel configuration: Headers
 * REF
 *    https://vercel.com/docs/project-configuration#project-configuration/headers
 */
export type VercelConfigKeyValue = { key: string; value: string };
export type VercelConfigHeader = {
  source: string;
  headers: VercelConfigKeyValue[];
  has?: VercelConfigHeaderHas;
};
export type VercelConfigHeaderHas = {
  type: 'header' | 'cookie' | 'host' | 'query';
  key?: string;
  value?: string;
};
