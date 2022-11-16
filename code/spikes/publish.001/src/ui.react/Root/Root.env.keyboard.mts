import { BundlePaths, Pkg, t } from '../common';

export const KeyboardMonitor = {
  listen(state: t.StateEvents) {
    const handler = async (e: KeyboardEvent) => {
      // CMD+S:
      if (e.key === 's' && e.metaKey) {
        // Cancel "save" HTML page (default browser action).
        e.preventDefault();
      }

      // CMD+K:
      if (e.key === 'k' && e.metaKey) {
        console.clear();
      }

      // CMD+P:
      if (e.key === 'p' && e.metaKey) {
        // Cancel "print" HTML page action (browser default).
        e.preventDefault();

        /**
         * PRINT info.
         */
        await logOutput(state);
      }
    };

    document.addEventListener('keydown', handler);
    return {
      dispose: () => document.removeEventListener('keydown', handler),
    };
  },
};

/**
 * [Helpers]
 */

async function logOutput(state: t.StateEvents) {
  const { info } = await state.info.get();

  const div = '💦'.repeat(12);

  console.info('');
  console.group(`${div}  CMD+P  ${div}`);
  console.info('Package:', Pkg);
  console.info('BundlePaths:', BundlePaths);
  console.info('State:', info?.current);
  console.groupEnd();
  console.info('');
}
