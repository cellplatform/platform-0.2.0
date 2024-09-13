import { Expect, Path } from './mod.ts';

Deno.test('Path', async (test) => {
  await test.step('join', () => {
    Expect.eql(Path.join('foo', 'bar'), 'foo/bar');
  });
});
