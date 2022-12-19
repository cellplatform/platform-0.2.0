import { ContentLogger } from '.';
import { describe, expect, it, t, TestSample } from '../test';

describe('ContentLog', () => {
  describe('Filename', () => {
    const Filename = ContentLogger.Filename;

    it('extension', () => {
      expect(Filename.ext).to.eql('.log.json');
    });

    it('create', () => {
      const res1 = Filename.create();
      const res2 = Filename.create('1.2.3');

      expect(res1.endsWith(Filename.ext)).to.eql(true);
      expect(res2.endsWith(Filename.ext)).to.eql(true);

      expect(res1).to.include('0.0.0');
      expect(res2).to.include('1.2.3');
    });
  });

  describe('write', () => {
    it('write.bundle: input param {bundle}', async () => {
      const { sources, target, bundler } = await TestSample.bundler();
      const bundle = await bundler.write.bundle(target, '0.1.0');

      await bundler.logger.write({ bundle: bundle.toObject() });
      const m = await sources.log.manifest();

      expect(m.files.length).to.eql(1);
      expect(m.files[0].path).to.include(`-0.1.0.log.json`);

      const json = await sources.log.json.read<t.LogEntry>(m.files[0].path);
      expect(json?.bundle).to.eql(bundle.toObject());
    });

    it('write.bundle: input param {bundle.toObject}', async () => {
      const { sources, target, bundler } = await TestSample.bundler();
      const bundle = await bundler.write.bundle(target, '0.1.0');

      await bundler.logger.write({ bundle });
      const m = await sources.log.manifest();

      expect(m.files.length).to.eql(1);
      expect(m.files[0].path).to.include(`-0.1.0.log.json`);

      const json = await sources.log.json.read<t.LogEntry>(m.files[0].path);
      expect(json?.bundle).to.eql(bundle.toObject());
    });
  });
});
