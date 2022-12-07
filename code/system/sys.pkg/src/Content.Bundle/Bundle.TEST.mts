import { Text } from 'sys.text';

import { Path, describe, expect, expectError, it, TestFilesystem } from '../test';
import { ContentBundle } from '.';

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
    const log = TestFilesystem.memory().events.fs();
    const src = TestFilesystem.memory().events.fs();
    const sources = { app, src, content, log };

    if (prefillWithData) {
      await sources.content.write('README.md', README);
    }

    return { sources, target };
  };

  it('throw: file does not exist', async () => {
    const { sources } = await setup();
    await sources.content.delete('README.md'); // Remove the README that will cause the error to throw.

    // Error thrown.
    const fn = () => ContentBundle.create({ Text, sources, throwError: true });
    await expectError(fn, 'File not found');

    // Error reported (silently).
    const pipeline = await ContentBundle.create({ Text, sources, throwError: false }); // NB: default.
    expect(pipeline.README.error).to.include('File not found');
  });

  it('load (default dir <none>)', async () => {
    const { sources, target } = await setup();
    const pipeline = await ContentBundle.create({ Text, sources });
    await pipeline.README.write(target);

    const m = await target.manifest();
    expect(m.files.length).to.eql(2);
    expect(m.files.map((f) => f.path)).to.eql(['README.md', 'README.md.html']);
  });

  it('write: default dir (none)', async () => {
    const { sources, target } = await setup();
    const pipeline = await ContentBundle.create({ Text, sources });
    await pipeline.write.bundle(target);

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);

    const expected = [
      'README.md',
      'app/data/index.json',
      'app/data/md/README.md',
      'app/index.json',
      'app/vercel.json',
      'index.json',
    ];

    expected.forEach((path) => expect(files).to.include(Path.join('0.1.2', path)));
    expected.forEach((path) => expect(files).to.include(Path.join('.latest', path)));
  });

  it('write: custom dir', async () => {
    const { sources, target } = await setup();
    const pipeline = await ContentBundle.create({ Text, sources });
    await pipeline.write.bundle(target, { dir: '/foo/bar/' });

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);

    expect(files).to.include('foo/bar/README.md');
    expect(files).to.include('foo/bar/app/index.json');

    expect(files).to.include('.latest/README.md');
    expect(files).to.include('.latest/app/index.json');
  });
});
