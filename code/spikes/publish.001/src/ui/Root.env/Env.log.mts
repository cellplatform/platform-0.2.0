import { BundlePaths, Pkg, t } from '../common';

export const EnvLog = {
  async current(state: t.StateEvents) {
    const { info } = await state.info.get();
    const hr = '💦'.repeat(12);

    console.info('');
    console.group(`${hr}  CMD+P  ${hr}`);
    console.info('Package:', Pkg);
    console.info('BundlePaths:', BundlePaths);
    console.info('State:', info?.current);
    console.groupEnd();
    console.info('');
  },
};
