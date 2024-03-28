import { Http, rx } from '../common';
import { TestFilesystem } from './libs.mjs';

const bus = rx.bus();
const token = process.env.VERCEL_TEST_TOKEN || '';

/**
 * Unit-test helpers.
 */
export const TestUtil = {
  bus,

  filesystem() {
    return TestFilesystem.memory({ bus }).fs;
  },

  /**
   * HTTP client.
   */
  get http() {
    const Authorization = `Bearer ${token}`;
    const headers = { Authorization };
    return Http.create({ headers });
  },
};
