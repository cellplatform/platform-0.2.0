import { Assert, Fs, Path } from '../mod.ts';

Deno.test('Path', async (test) => {
  await test.step('filesystem extensions', () => {
    Assert.eql(Fs.Path, Path);
    Assert.eql(Path.exists, Fs.exists);
    Assert.eql(Path.ensureDir, Fs.ensureDir);
  });
});
