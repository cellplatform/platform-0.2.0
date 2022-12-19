import { Filesystem, NodeFs } from 'sys.fs.node';
import { Text } from 'sys.text';

import { rx, slug } from '../common';
import { Content } from '../Content';

const bus = rx.bus();
const TMPDIR = 'tmp/tests';

const README = `
# My Report

\`\`\`yaml project.props
version: 0.1.2
\`\`\`
`;

type Options = { prefillWithData?: boolean };

export const TestSample = {
  README,

  async deleteAll() {
    await NodeFs.remove(NodeFs.resolve(TMPDIR));
  },

  /**
   * A set of sample filesystem references.
   */
  async filesystems(options: Options = {}) {
    const { prefillWithData = true } = options;
    const rootdir = NodeFs.resolve(TMPDIR, `test.${slug()}`);

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

  /**
   * A bundler made with a set of sample filesystem references.
   */
  async bundler(options: Options = {}) {
    const { sources, target, rootdir } = await TestSample.filesystems(options);
    const bundler = await Content.bundler({ Text, sources });
    return { sources, target, bundler, rootdir };
  },
};
