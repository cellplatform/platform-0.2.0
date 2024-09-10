import { Foo } from './mod.ts';
import { assertEquals } from 'https://deno.land/std@0.185.0/testing/asserts.ts'; // latest version

Deno.test('Foo.count', () => {
  assertEquals(Foo.count, 0);

  Foo.inc(2);
  assertEquals(Foo.count, 2);

  Foo.inc();
  assertEquals(Foo.count, 3);
});
