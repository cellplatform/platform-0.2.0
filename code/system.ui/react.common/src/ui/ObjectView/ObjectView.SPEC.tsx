import { ObjectView } from '.';
import { COLORS, Dev } from '../../test.ui';

import type { ObjectViewProps as T } from '.';

export default Dev.describe('ObjectView', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.size(350, null).render<T>((e) => {
      return <ObjectView {...e.state} />;
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e);

    dev
      .button((btn) =>
        btn.label('undefined').onClick((e) => e.state.change((draft) => (draft.data = undefined))),
      )
      .button((btn) =>
        btn.label('set {object}').onClick((e) => {
          e.state.change(
            (draft) => (draft.data = { msg: '👋', list: [1, 2, 'three'], count: 123 }),
          );
        }),
      );

    dev
      .hr()
      .button((btn) =>
        btn.label('Light').onClick((e) => {
          e.ctx.host.backgroundColor(1).gridColor(null);
          e.state.change((draft) => (draft.theme = 'Light'));
        }),
      )
      .button((btn) =>
        btn.label('Dark').onClick((e) => {
          e.ctx.host.backgroundColor(COLORS.DARK).gridColor(0.06);
          e.state.change((draft) => (draft.theme = 'Dark'));
        }),
      );
  });
});
