import { ObjectView } from '.';
import { COLORS, Dev } from '../../test.ui';

import type { ObjectViewProps } from '.';

type T = ObjectViewProps;
const initial = {};

export default Dev.describe('ObjectView', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.size(350, null).render<T>((e) => {
      const props = e.state;
      return <ObjectView {...props} />;
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    const value = (label: string, value: any) => {
      dev.button((btn) => {
        btn.label(label).onClick((e) => {
          e.change((draft) => (draft.data = value));
        });
      });
    };

    value('`undefined`', undefined);
    value('`null`', null);
    value('`true`', true);
    value('`123`', 123);
    value('`"Hello"`', 'Hello');
    value('`{object}`', { msg: '👋', list: [1, [{ msg: 'two' }], 'three'], count: 123 });
    value('`[array]`', [1, 'two', { id: 'abc' }]);
    dev.hr();

    dev
      .button((btn) =>
        btn.label('theme: Light').onClick((e) => {
          e.ctx.host.backgroundColor(null).gridColor(null);
          e.change((draft) => (draft.theme = 'Light'));
        }),
      )
      .button((btn) =>
        btn.label('theme: Dark').onClick((e) => {
          e.ctx.host.backgroundColor(COLORS.DARK).gridColor(0.06);
          e.change((draft) => (draft.theme = 'Dark'));
        }),
      )
      .hr();

    dev.button((btn) => btn.label('expand = 99').onClick((e) => e.change((e) => (e.expand = 99))));
    dev.button((btn) => btn.label('expand = 1').onClick((e) => e.change((e) => (e.expand = 1))));
  });
});
