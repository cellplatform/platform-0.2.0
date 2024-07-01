import { semver } from './libs';

/**
 * Helpers for working with "semantic-version" values.
 */
export const Version = {
  clean(version?: string) {
    return clean(version);
  },

  trimAdornment(version: string) {
    version = trim(version);
    let adornment = '';
    if (version.startsWith('^')) adornment = '^';
    if (version.startsWith('~')) adornment = '~';
    version = Version.clean(version);
    return { version, adornment };
  },

  eq(a?: string, b?: string) {
    return Version.clean(a) === Version.clean(b);
  },

  max(a?: string, b?: string) {
    if (a === undefined && b === undefined) return '0.0.0';
    if (a === undefined) return b ?? '0.0.0';
    if (b === undefined) return a ?? '0.0.0';
    return semver.gte(clean(a) || '0.0.0', clean(b) || '0.0.0') ? a : b;
  },
} as const;

/**
 * Helpers
 */
function trim(value?: string) {
  return (value || '').trim();
}

function clean(version?: string) {
  let res = trim(version);
  const prerelease = res.includes('-') ? res.substring(res.indexOf('-')) : '';
  res = trim(res).replace(/^\^/, '').replace(/^\~/, '');
  res = semver.coerce(res)?.version || '';
  return `${res}${prerelease}`;
}
