import { fs, Paths, t } from './common.mjs';

type TemplateKind = 'vite.config' | 'esm.json';

/**
 * Template helpers.
 */
export const Template = {
  /**
   * Construct a template path.
   */
  path(...path: string[]) {
    return fs.join(Paths.tmpl.dir, ...path);
  },

  /**
   * Check for the existence of a template file and copy if not already in the target.
   */
  async ensureExists(kind: TemplateKind, targetDir: t.PathString) {
    const copyMaybe = async (source: t.PathString, target: t.PathString) => {
      source = fs.resolve(source);
      target = fs.resolve(target);
      if (await fs.pathExists(target)) return false;
      await fs.copy(source, target);
      return true;
    };

    if (kind === 'vite.config') {
      const filename = 'vite.config.ts';
      const source = Template.path(filename);
      const target = fs.join(targetDir, filename);
      return await copyMaybe(source, target);
    }

    if (kind === 'esm.json') {
      const filename = 'esm.json';
      const source = Template.path(filename);
      const target = fs.join(targetDir, filename);
      return await copyMaybe(source, target);
    }

    throw new Error(`template '${kind}' not supported`);
  },
};
