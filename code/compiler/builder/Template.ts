import { fs, type t } from './common';
import { Paths } from './Paths';

type TemplateKind = 'config' | 'esm.json' | 'entry:src' | 'entry:html';

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
  async ensureExists(kind: TemplateKind, targetDir: t.DirString) {
    targetDir = fs.resolve(targetDir);

    const copyMaybe = async (source: t.PathString, target: t.PathString) => {
      source = fs.resolve(source);
      target = fs.resolve(target);
      if (await fs.pathExists(target)) return false;
      await fs.copy(source, target);
      return true;
    };

    const copyFileMaybe = async (file: t.PathString) => {
      await copyMaybe(Template.path(file), fs.join(targetDir, file));
    };

    if (kind === 'config') {
      await copyFileMaybe(Paths.tmpl.config);
      return;
    }

    if (kind === 'entry:src') {
      const srcExists = await fs.pathExists(fs.join(targetDir, 'src'));
      if (!srcExists) {
        for (const path of Paths.tmpl.src) {
          await copyFileMaybe(path);
        }
      }
      return;
    }

    if (kind === 'entry:html') {
      await copyFileMaybe(Paths.tmpl.indexHtml);
      return;
    }

    throw new Error(`template '${kind}' not supported`);
  },

  /**
   * Ensure the target directory has baseline files within it.
   */
  async ensureBaseline(targetDir: t.DirString) {
    const ensure = Template.ensureExists;
    await ensure('config', targetDir);
    await ensure('entry:src', targetDir);
    await ensure('entry:html', targetDir);
  },
};
