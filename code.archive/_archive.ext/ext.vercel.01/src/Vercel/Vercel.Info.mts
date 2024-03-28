import { t, Filesize } from './common';
import { VercelFs } from './Vercel.Fs.mjs';
import { VercelHttpInfo } from './Vercel.Http/VercelHttp.Info.mjs';

export const VercelInfo = {
  Http: VercelHttpInfo,

  /**
   * Derive information about a deployment bundle.
   */
  async bundle(args: { fs: t.Fs; source: string | t.VercelSourceBundle; name?: string }) {
    const { fs, source } = args;
    const manifest = await VercelFs.wrangleManifest({ fs, source });
    const bundle = typeof source === 'string' ? await VercelFs.readdir(fs, source) : source;
    let name = args.name;

    let meta: t.VercelHttpDeployMeta = {
      kind: 'bundle:plain/files',
      fileshash: bundle.manifest.hash.files,
      bytes: bundle.manifest.files.reduce((acc, next) => acc + next.bytes, 0).toString(),
    };

    if (manifest) {
      const kind = (manifest as any)?.kind;
      if (kind === 'module') {
        const m = manifest as t.ModuleManifest;
        const { namespace, version } = m.module;
        meta = {
          ...meta,
          kind: 'bundle:code/module',
          namespace,
        };
        name = name ?? `${namespace}-v${version}`;
      }
    }

    const files = {
      hash: meta.fileshash,
      total: bundle.files.length,
      size: {
        bytes: bundle.manifest.files.reduce((acc, next) => acc + next.bytes, 0),
        toString: () => Filesize(files.size.bytes),
      },
      toString() {
        const total = files.total;
        const fileSummary = `${total} ${total === 1 ? 'file' : 'files'}`;
        const sha256 = meta.fileshash.substring('sha256-'.length);
        const hash = `SHA256( ${sha256.substring(0, 5)}..${sha256.substring(sha256.length - 5)} )`;
        return `${files.size.toString()} (${fileSummary}) | ${hash}`;
      },
    };

    // Final preparation of meta-data.
    // const version = meta.version;
    Object.keys(meta)
      .map((key) => key as keyof t.VercelHttpDeployMeta)
      .map((key) => (meta[key] = meta[key].toString() as any)); // NB: Ensure all values are strings.
    name = name ?? `unnamed-v${'0.0.0'}`;

    // Finish up.
    const info: t.VercelSourceBundleInfo = {
      name,
      files,
      meta,
      source: bundle,
    };

    return info;
  },
};
