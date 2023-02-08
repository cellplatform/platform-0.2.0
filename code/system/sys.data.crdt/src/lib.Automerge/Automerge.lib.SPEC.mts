import { Dev, expect } from '../test.ui';
import { Automerge } from './lib.mjs';

export default Dev.describe('Automerge (lib)', (e) => {
  e.it('start', async (e) => {
    console.log('----------------------------------------');
    console.log('Automerge', Automerge.change);
  });
});
