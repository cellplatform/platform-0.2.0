import { Text } from 'sys.text';

import { describe, expect, expectError, it, TestFilesystem } from '../test/index.mjs';
import { ContentBundle } from './index.mjs';

describe('ContentPipeline.README', () => {
  const README = `
# My Report

\`\`\`yaml project.props
version: 0.1.2
\`\`\`

`;

  const setup = async (options: { prefillWithData?: boolean } = {}) => {
    const { prefillWithData = true } = options;

    const app = TestFilesystem.memory().events.fs();
    const content = TestFilesystem.memory().events.fs();
    const target = TestFilesystem.memory().events.fs();
    const src = { app, content };

    if (prefillWithData) {
      await src.content.write('README.md', README);
    }

    return { src, target };
  };

  it('throw: file does not exist', async () => {
    const { src } = await setup();
    await src.content.delete('README.md'); // Remove the README that will cause the error to throw.

    // Error thrown.
    const fn = () => ContentBundle({ Text, src, throwError: true });
    await expectError(fn, 'File not found');

    // Error reported (silently).
    const pipeline = await ContentBundle({ Text, src, throwError: false }); // NB: default.
    expect(pipeline.README.error).to.include('File not found');
  });

  it('load (default dir <none>)', async () => {
    const { src, target } = await setup();
    const pipeline = await ContentBundle({ Text, src });
    await pipeline.README.write(target);

    const m = await target.manifest();
    expect(m.files.length).to.eql(2);
    expect(m.files.map((f) => f.path)).to.eql(['README.md', 'README.md.html']);
  });

  it('write: default dir (none)', async () => {
    const { src, target } = await setup();
    const pipeline = await ContentBundle({ Text, src });
    await pipeline.write(target);

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);

    expect(files).to.includes('0.1.2/app/README.md');
    expect(files).to.includes('0.1.2/app/README.md.html');

    console.log('files', files);
  });

  it('write: custom dir', async () => {
    const { src, target } = await setup();
    const pipeline = await ContentBundle({ Text, src });
    await pipeline.write(target, { dir: '/foo/bar/' });

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);

    expect(files).to.includes('foo/bar/0.1.2/app/README.md');
    expect(files).to.includes('foo/bar/0.1.2/app/README.md.html');
  });
});
