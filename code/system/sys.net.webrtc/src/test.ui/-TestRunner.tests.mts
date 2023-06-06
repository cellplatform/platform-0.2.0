export const TESTS = {
  get all() {
    return [
      'Network',
      import('../WebRtc/-dev/-TEST.mjs'),
      import('../WebRtc/-dev/-TEST.conn.data.mjs'),
      import('../WebRtc/-dev/-TEST.conn.media.mjs'),

      'Controller',
      import('../WebRtc.Controller/-dev/-TEST.controller.mjs'),
      import('../WebRtc.Controller/-dev/-TEST.controller.3-way.mjs'),
      import('../WebRtc.Controller/-dev/-TEST.controller.fails.mjs'),

      'State',
      import('../WebRtc.State/-dev/-TEST.mjs'),
      import('../WebRtc.State/-dev/-TEST.mutate.mjs'),
      import('../sys.net.schema/-TEST.mjs'),

      'Connectors',
      import('../WebRtc/-dev/-TEST.sync.mjs'),
      import('../WebRtc.Media/-TEST.mjs'),

      'Internal',
      import('./-dev.mocks/-TEST.mjs'),
    ];
  },
};
