import { expect, Path } from '../mod.ts';

Deno.test('Path', async (test) => {
  await test.step('join', () => {
    expect(Path.join('foo', 'bar')).to.eql('foo/bar');
  });
});
