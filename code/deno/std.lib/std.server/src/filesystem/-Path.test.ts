import { Expect, Fs, Path } from '../mod.ts';

Deno.test('Path', async (test) => {
  await test.step('filesystem extensions', () => {
    Expect.eql(Fs.Path, Path);
    Expect.eql(Path.exists, Fs.exists);
    Expect.eql(Path.ensureDir, Fs.ensureDir);
  });
});
