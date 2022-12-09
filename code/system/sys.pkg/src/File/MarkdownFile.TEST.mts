import { describe, expect, expectError, it, TestFilesystem, Text } from '../test';

import { MarkdownFile } from '.';

describe('MarkdownFile', () => {
  const README = `
# My Report

\`\`\`yaml my.type
version: 0.1.2
count: 42
\`\`\`

`;

  const setup = async () => {
    const target = TestFilesystem.memory().fs;
    const src = TestFilesystem.memory().fs;
    return { src, target };
  };

  it('no file', async () => {
    const { src } = await setup();

    const path = 'foo/README.md';
    const res = await MarkdownFile({ Text, src, path });
    expect(res.error).to.include('File not found: foo/README.md');

    // NB: empty content (no file).
    expect(res.content.html).to.eql('');
    expect(res.content.markdown).to.eql('');
    expect(res.props.version).to.eql('0.0.0'); // Default <none> version.
  });

  it('no file: throw', async () => {
    const { src } = await setup();
    const fn = () => MarkdownFile({ Text, src, path: 'README.md', throwError: true });
    expectError(fn, 'File not found: README.md');
  });

  it('loads', async () => {
    const { src } = await setup();
    const path = 'foo/README.md';
    await src.write(path, README);
    const res = await MarkdownFile({ Text, src, path, propsType: 'my.type' });
    expect(res.error).to.eql(undefined);

    expect(res.props.version).to.eql('0.1.2');
    expect(res.file.path).to.eql(path);
    expect(res.content.html).to.include('<h1>My Report</h1>');
    expect(res.content.html).to.include('data-type="my.type"></div>');
    expect(res.content.markdown).to.include('# My Report\n\n');
    expect(res.content.markdown).to.include('version: 0.1.2');
    expect(res.content.markdown).to.include('count: 42');
  });

  it('loads with extended <PropType>', async () => {
    const { src } = await setup();
    type T = { version: string; count: number };

    const path = 'foo/README.md';
    await src.write(path, README);
    const res = await MarkdownFile<T>({ Text, src, path, propsType: 'my.type' });

    expect(res.props.version).to.eql('0.1.2');
    expect(res.props.count).to.eql(42);
  });

  it('no match on "propType"', async () => {
    const { src } = await setup();

    const path = 'README.md';
    await src.write(path, README);

    const res1 = await MarkdownFile({ Text, src, path });
    const res2 = await MarkdownFile({ Text, src, path, propsType: 'BOO' });

    // NB: Default version (0.0.0) because no match on the code-block
    expect(res1.props.version).to.eql('0.0.0');
    expect(res2.props.version).to.eql('0.0.0');
  });

  it('no code-block within markdown', async () => {
    const { src } = await setup();
    const path = 'README.md';
    await src.write(path, '# Hello');

    const res = await MarkdownFile({ Text, src, path });
    expect(res.props).to.eql({ version: '0.0.0' }); // NB: Default
  });

  it('write (defaults)', async () => {
    const { src, target } = await setup();
    const path = 'README.md';
    await src.write(path, '# Hello');

    const file = await MarkdownFile({ Text, src, path });
    await file.write(target);
    await file.write(target, { dir: 'foo/bar' });

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);

    expect(files.length).to.eql(4);
    expect(files).to.includes('README.md');
    expect(files).to.includes('README.md.html');
    expect(files).to.includes('foo/bar/README.md');
    expect(files).to.includes('foo/bar/README.md.html');
  });

  it('write: html (only)', async () => {
    const { src, target } = await setup();
    const path = 'README.md';
    await src.write(path, '# Hello');

    const file = await MarkdownFile({ Text, src, path });
    await file.write(target, { md: false });

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);
    expect(files).to.eql(['README.md.html']);
  });

  it('write: md (only)', async () => {
    const { src, target } = await setup();
    const path = 'README.md';
    await src.write(path, '# Hello');

    const file = await MarkdownFile({ Text, src, path });
    await file.write(target, { html: false });

    const m = await target.manifest();
    const files = m.files.map((f) => f.path);
    expect(files).to.eql(['README.md']);
  });
});
