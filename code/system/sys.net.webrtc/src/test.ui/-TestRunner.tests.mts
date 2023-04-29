export const TESTS = {
  all() {
    return [
      import('../WebRtc/-dev/-TEST.mjs'),
      import('../WebRtc/-dev/-TEST.conn.data.mjs'),
      import('../WebRtc/-dev/-TEST.conn.media.mjs'),

      import('../WebRtc.Controller/-dev/-TEST.controller.mutate.mjs'),
      import('../WebRtc.Controller/-dev/-TEST.controller.mjs'),
      import('../WebRtc.Controller/-dev/-TEST.controller.3-way.mjs'),
      import('../sys.net.schema/Schema.TEST.mjs'),

      import('../WebRtc/-dev/-TEST.sync.mjs'),
      import('../WebRtc.Media/-TEST.mjs'),

      import('./-dev.mocks/-TEST.mjs'),
    ];
  },
};
