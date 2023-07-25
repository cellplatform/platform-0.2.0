import { Pkg } from '../index.pkg.mjs';
import { expect, Test } from '../test.ui';

import { HatsClient } from '@hatsprotocol/sdk-v1-core';

/**
 * Docs:
 *    https://docs.hatsprotocol.xyz/for-developers/v1-core-sdk/
 */
export default Test.describe('protocol.hats: client', (e) => {
  e.it('init', async (e) => {
    console.log('HatsClient', HatsClient);
  });
});
