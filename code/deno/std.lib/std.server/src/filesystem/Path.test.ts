import { expect, Fs, Path } from '../mod.ts';

Deno.test('Path', async (test) => {
  await test.step('filesystem extensions', () => {
    expect(Path).to.equal(Fs.Path);
    expect(Path.exists).to.equal(Fs.exists);
    expect(Path.ensureDir).to.equal(Fs.ensureDir);
  });
});
