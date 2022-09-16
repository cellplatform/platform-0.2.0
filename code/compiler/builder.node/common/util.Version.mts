export const VersionUtil = {
  clean(version?: string) {
    return trim(version).replace(/^\^/, '').replace(/^\~/, '');
  },

  trimAdornment(version: string) {
    version = trim(version);
    let adornment = '';
    if (version.startsWith('^')) adornment = '^';
    if (version.startsWith('~')) adornment = '~';
    version = VersionUtil.clean(version);
    return { version, adornment };
  },
};

/**
 * Helpers
 */
function trim(value?: string) {
  return (value || '').trim();
}
