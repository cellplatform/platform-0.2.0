import { ContentBundler } from '.';
import { Pkg } from '../index.pkg.mjs';
import { describe, expect, expectError, it, Path, t, TestSample, Text, Time } from '../test';

describe('ContentBundler', () => {
  describe('README', () => {
    it('throw: file does not exist', async () => {
      const { sources } = await TestSample.filesystems();
      await sources.data.delete('README.md'); // Remove the README that will cause the error to throw.

      // Error thrown.
      const fn = () => ContentBundler.create({ Text, sources, throwError: true });
      await expectError(fn, 'File not found');

      // Error reported (silently).
      const bundler = await ContentBundler.create({ Text, sources, throwError: false }); // NB: default.
      expect(bundler.README.error).to.include('File not found');
    });

    it('load (default dir <none>)', async () => {
      const { sources, target } = await TestSample.filesystems();
      const bundler = await ContentBundler.create({ Text, sources });
      expect(bundler.README.props.version).to.eql('0.1.2');

      await bundler.README.write(target);
      const m = await target.manifest();

      expect(m.files.length).to.eql(2);
      expect(m.files.map((f) => f.path)).to.eql(['README.md', 'README.md.html']);
    });
  });

  describe('write: bundle', () => {
    it('write: default dir (none)', async () => {
      const { sources, target } = await TestSample.filesystems();
      const bundler = await ContentBundler.create({ Text, sources });
      await bundler.write.bundle(target, '1.2.3');

      await Time.wait(100);

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

      expected.forEach((path) => expect(files).to.include(Path.join('1.2.3', path)));
      expected.forEach((path) => expect(files).to.include(Path.join('.latest', path)));
    });

    it('write: custom dir', async () => {
      const { sources, target } = await TestSample.filesystems();
      const bundler = await ContentBundler.create({ Text, sources });
      await bundler.write.bundle(target, '1.2.3', { dir: '/foo/bar/' });

      const m = await target.manifest();
      const files = m.files.map((f) => f.path);

      expect(files).to.include('foo/bar/README.md');
      expect(files).to.include('foo/bar/app/index.json');

      expect(files).to.include('.latest/README.md');
      expect(files).to.include('.latest/app/index.json');
    });

    it('write: version', async () => {
      const { target, bundler } = await TestSample.bundler();

      const bundle1 = await bundler.write.bundle(target, '0.1.2');
      const bundle2 = await bundler.write.bundle(target, '0.1.3');

      expect(bundle1.version).to.eql('0.1.2');
      expect(bundle2.version).to.eql('0.1.3');

      const m = await target.manifest();
      const files = m.files.map((f) => f.path);

      const expectToInclude = (prefix: string) => {
        const exists = files.some((path) => path.startsWith(prefix));
        expect(exists).to.eql(true, prefix);
      };

      expectToInclude('.latest/');
      expectToInclude('0.1.2/');
      expectToInclude('0.1.3/');
    });
  });

  describe('logging', () => {
    it('write: no prior history', async () => {
      const { sources, target, bundler } = await TestSample.bundler();

      const bundle = await bundler.write.bundle(target, '1.2.3');
      await bundler.logger.write({ bundle: bundle.toObject() });

      const logs = await sources.log.manifest();
      const logfile = await sources.log.json.read<t.LogEntry>(logs.files[0].path);

      expect(logs.files.length).to.eql(1);
      expect(logfile?.packagedBy).to.eql(`${Pkg.name}@${Pkg.version}`);
      expect(logfile?.bundle).to.eql(bundle.toObject());
      expect(logfile?.deployment).to.eql(undefined);

      // NB: Derived from the actual logs, and packaged as data within the bundle.
      const latest = target.dir(ContentBundler.Paths.latest);
      const publicLog = await latest.json.read<t.LogHistoryPublic>('app/data/log.json');
      expect(publicLog?.latest.version).to.eql(bundle.version);
      expect(publicLog?.history).to.eql([]); // NB: Public history.
    });

    it('write: has prior history', async () => {
      const { target, bundler } = await TestSample.bundler();

      const bundle = await bundler.write.bundle(target, '1.0.0');
      await bundler.logger.write({
        bundle: bundle.toObject(),
        deployment: { kind: 'vercel:deployment', status: 200 },
      });

      await bundler.write.bundle(target, '1.0.1');

      const latest = target.dir(ContentBundler.Paths.latest);
      const logfile = await latest.json.read<t.LogHistoryPublic>('app/data/log.json');
      const history = logfile?.history ?? [];

      expect(logfile?.latest.version).to.eql('1.0.1');
      expect(history.length).to.eql(1);
      expect(history[0].version).to.eql('1.0.0');
    });
  });
});
