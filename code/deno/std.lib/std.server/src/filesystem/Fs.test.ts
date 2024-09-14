import { expect, Fs } from '../mod.ts';

Deno.test('Fs: filesystem', async (test) => {
  await test.step('glob', async () => {
    const base = Fs.resolve();
    const glob = Fs.glob(base);

    const matches = await glob.find('**');
    expect(matches.length).to.be.greaterThan(3);

    const self = matches.find((item) => item.path === import.meta.filename);
    expect(self?.isFile).to.eql(true);
    expect(self?.name).to.eql(Fs.Path.basename(import.meta.filename ?? ''));
  });
});
