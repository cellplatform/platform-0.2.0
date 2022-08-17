import { fs, Paths, t } from './common.mjs';

type TemplateKind = 'vite.config';

/**
 * Template helpers.
 */
export const Template = {
  /**
   * Construct a template path.
   */
  path(...path: string[]) {
    return fs.join(Paths.templateDir, ...path);
  },

  /**
   * Check for the existence of a template file and copy if not already in the target.
   */
  async ensureFileExists(kind: TemplateKind, targetDir: t.PathString) {
    const copyWhenAbsent = async (source: t.PathString, target: t.PathString) => {
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
      return await copyWhenAbsent(source, target);
    }

    throw new Error(`template '${kind}' not supported`);
  },
};
