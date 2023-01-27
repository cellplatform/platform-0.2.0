import { expect, MemoryMock, t, Path } from './common';

export const InfoSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory, root } = ctx;

  const toLocation = (path: string) => Path.toAbsoluteLocation(path, { root });

  describe('info', () => {
    it('does not exist', async () => {
      const driver = (await factory()).io;
      const uri = '  path:foo/bar.txt  ';
      const res = await driver.info(uri);

      expect(res.uri).to.eql(uri.trim());
      expect(res.exists).to.eql(false);
      expect(res.kind).to.eql('unknown');
      expect(res.path).to.eql('/foo/bar.txt');
      expect(res.location).to.eql(toLocation('foo/bar.txt'));
      expect(res.hash).to.eql('');
      expect(res.bytes).to.eql(-1);
      expect(res.error).to.eql(undefined);
    });

    it('root directory ("path:.")', async () => {
      const test = async (path: string) => {
        const driver = (await factory()).io;
        const res = await driver.info(path);

        expect(res.uri).to.eql('path:/');
        expect(res.path).to.eql('/');
        expect(res.location).to.eql(toLocation(''));
        expect(res.hash).to.eql('');
        expect(res.bytes).to.eql(-1);
        expect(res.error).to.eql(undefined);
      };

      await test('path:/');
      await test('path:'); // NB: root "/" inferred.
      await test('  path:.  ');
    });

    it('info.kind: "file" | "dir" | "unknown"', async () => {
      const uri = 'path:foo/bar/file.txt';
      const driver = (await factory()).io;

      const file = MemoryMock.randomFile();
      await driver.write(uri, file.data);

      const res1 = await driver.info(uri);
      const res2 = await driver.info('path:foo/bar');
      const res3 = await driver.info('path:foo/bar/');
      const res4 = await driver.info('path:404');

      expect(res1.kind).to.eql('file', res1.kind);
      expect(res2.kind).to.eql('dir', res2.kind);
      expect(res3.kind).to.eql('dir', res3.kind);
      expect(res4.kind).to.eql('unknown', res4.kind);
    });

    it('error: path out of scope', async () => {
      const driver = (await factory()).io;
      const uri = 'path:../foo';
      const res = await driver.info(uri);

      expect(res.uri).to.eql(uri);
      expect(res.path).to.eql('');
      expect(res.location).to.eql('');
      expect(res.hash).to.eql('');
      expect(res.bytes).to.eql(-1);
      expect(res.error?.code).to.eql('fs:info');
      expect(res.error?.message).to.include('Path out of scope');
      expect(res.error?.path).to.eql('../foo');
    });
  });
};
