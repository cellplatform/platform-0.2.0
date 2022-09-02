import { t } from '../common/index.mjs';

export const deleteAll = async (fs: t.FsIndexedDb) => {
  const manifest = await fs.indexer.manifest();
  for (const file of manifest.files) {
    await fs.driver.delete(`path:${file.path}`);
  }
};
