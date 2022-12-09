import { Filesystem, NodeFs } from 'sys.fs.node';
import { Text } from 'sys.text';
import { rx, TestFilesystem, slug } from '../common';
import { Content } from '../Content';

const bus = rx.bus();
const TMP = 'tmp/tests';

const README = `
# My Report

\`\`\`yaml project.props
version: 0.1.2
\`\`\`
`;

type Options = { prefillWithData?: boolean };

export const TestSample = {
  README,

  async reset() {
    await NodeFs.remove(NodeFs.resolve(TMP));
  },

  async filesystems(options: Options = {}) {
    const { prefillWithData = true } = options;

    const rootdir = NodeFs.resolve(TMP, `test.${slug()}`);
    const dir = async (dir: string) => {
      const path = NodeFs.join(rootdir, dir);
      const store = await Filesystem.client(path, { bus });
      return store.fs;
    };

    const app = await dir('source/dist/web');
    const src = await dir('source/src');
    const data = await dir('source/src.data');
    const log = await dir('.log');
    const sources = { app, data, src, log };

    const target = await dir('target');

    if (prefillWithData) await sources.data.write('README.md', README);
    return { sources, target, rootdir };
  },

  async bundler(options: Options & { version?: string } = {}) {
    const { version } = options;
    const { sources, target, rootdir } = await TestSample.filesystems(options);
    const bundler = await Content.bundler({ Text, sources, version });
    return { sources, target, bundler, rootdir };
  },
};
