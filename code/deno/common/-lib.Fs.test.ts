import { Expect } from './lib.Testing.ts';
import { Fs } from './mod.ts';

Deno.test('Fs (filesystem)', async (t) => {
  await t.step('glob', async () => {
    const glob = Fs.glob(Fs.resolve('.'));

    const res = await glob.find('**');
    Expect.greater(res.length, 3);

    const self = res.find((item) => item.path === import.meta.filename);
    Expect.eql(self?.isFile, true);
    Expect.eql(self?.name, Fs.Path.basename(import.meta.filename ?? ''));
  });
});
