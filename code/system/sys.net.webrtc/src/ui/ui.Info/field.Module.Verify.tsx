import { t, TestRunner, DEFAULTS } from './common';

export function FieldModuleVerify(fields: t.WebRtcInfoFields[], data: t.WebRtcInfoData) {
  return TestRunner.PropList.item({
    infoUrl: Wrangle.infoUrl(),
    async get() {
      const { TESTS } = await import('../../test.ui/-TestRunner.tests.mjs');
      const root = await TestRunner.bundle(TESTS.all());
      const ctx = {};
      return { root, ctx };
    },
  });
}

/**
 * [Helpers]
 */

const Wrangle = {
  infoUrl() {
    const url = new URL(location.origin);
    url.searchParams.set(DEFAULTS.query.dev, 'sys.net.webrtc.tests');
    return url.href;
  },
};
