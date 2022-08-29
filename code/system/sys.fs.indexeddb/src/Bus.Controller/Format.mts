export const Format = {
  file: {
    trimPrefix(input: string) {
      return (input ?? '').trim().replace(/^file:\/\//, '');
    },
  },

  path: {
    trimPrefix(input: string) {
      return (input ?? '').trim().replace(/^path:/, '');
    },
    ensurePrefix(input: string) {
      return `path:${Format.path.trimPrefix(input)}`;
    },
  },

  dir: {
    stripPrefix(dir: string, path: string) {
      path = Format.path.trimPrefix(path);
      path = Format.file.trimPrefix(path);
      if (path.startsWith(dir)) path = path.substring(dir.length);
      path = path.replace(/^\/*/, '');
      return `/${path}`;
    },
  },
};
