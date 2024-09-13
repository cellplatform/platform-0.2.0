import { Expect, Fs } from './mod.ts';

Deno.test('Fs: filesystem', async (test) => {
  await test.step('glob', async () => {
    const base = Fs.resolve();
    const glob = Fs.glob(base);

    const matches = await glob.find('**');
    Expect.greater(matches.length, 3);

    const self = matches.find((item) => item.path === import.meta.filename);
    Expect.eql(self?.isFile, true);
    Expect.eql(self?.name, Fs.Path.basename(import.meta.filename ?? ''));
  });
});
