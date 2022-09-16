import { semver } from './libs.mjs';

/**
 * Helpers for working with "semantic-version" values.
 */
export const VersionUtil = {
  clean(version?: string) {
    return clean(version);
  },

  trimAdornment(version: string) {
    version = trim(version);
    let adornment = '';
    if (version.startsWith('^')) adornment = '^';
    if (version.startsWith('~')) adornment = '~';
    version = VersionUtil.clean(version);
    return { version, adornment };
  },

  eq(a?: string, b?: string) {
    return VersionUtil.clean(a) === VersionUtil.clean(b);
  },

  max(a?: string, b?: string) {
    if (a === undefined && b === undefined) return '0.0.0';
    if (a === undefined) return b ?? '0.0.0';
    if (b === undefined) return a ?? '0.0.0';
    return semver.gte(clean(a), clean(b)) ? a : b;
  },
};

/**
 * Helpers
 */
function trim(value?: string) {
  return (value || '').trim();
}

function clean(version?: string) {
  version = trim(version).replace(/^\^/, '').replace(/^\~/, '');
  return semver.coerce(version)?.version || '';
}
