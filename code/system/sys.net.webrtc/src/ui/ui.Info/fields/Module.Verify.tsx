import { DEFAULTS, TestRunner, type t } from '../common';

export function FieldModuleVerify(args: { fields: t.WebRtcInfoField[]; data: t.WebRtcInfoData }) {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,

    infoUrl() {
      const url = new URL(location.origin);
      url.searchParams.set(DEFAULTS.query.dev, 'sys.net.webrtc.tests');
      return url.href;
    },

    async modules() {
      const { TESTS } = await import('../../../test.ui/-TestRunner.TESTS.mjs');
      return TESTS.all;
    },
  });
}
