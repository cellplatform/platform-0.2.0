import { Assert, Path } from '../mod.ts';

Deno.test('Path', async (test) => {
  await test.step('join', () => {
    Assert.eql(Path.join('foo', 'bar'), 'foo/bar');
  });
});
