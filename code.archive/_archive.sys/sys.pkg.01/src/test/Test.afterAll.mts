import { afterAll } from 'vitest';
import { TestSample } from './Test.Sample.mjs';

afterAll(async () => {
  await TestSample.deleteAll();
});
