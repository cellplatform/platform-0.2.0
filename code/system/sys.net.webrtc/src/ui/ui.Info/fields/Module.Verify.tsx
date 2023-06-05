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

    async all() {
      const { TESTS } = await import('../../../test.ui/-TestRunner.tests.mjs');
      return TESTS.all;
    },
  });
}
