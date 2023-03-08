import { ObjectView } from '.';
import { Dev } from '../../test.ui';

import type { ObjectViewProps } from '.';

type T = ObjectViewProps;
const initial: T = {
  name: 'Foo',
  data: { msg: '👋', list: [1, [{ msg: 'two' }], 'three'], count: 123, foo: false },
};

export default Dev.describe('ObjectView', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject.size(350, null).render<T>((e) => {
      const props = e.state;
      return <ObjectView {...props} />;
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('showNonenumerable')
          .value((e) => e.state.showNonenumerable ?? ObjectView.DEFAULTS.showNonenumerable)
          .onClick((e) => e.change((d) => Dev.toggle(d, 'showNonenumerable'))),
      );

      dev.boolean((btn) =>
        btn
          .label('showRootSummary')
          .value((e) => e.state.showRootSummary ?? ObjectView.DEFAULTS.showRootSummary)
          .onClick((e) => e.change((d) => Dev.toggle(d, 'showRootSummary'))),
      );
    });

    dev.hr();

    dev.section('Configurations', (e) => {
      dev.boolean((btn) =>
        btn
          .label('name')
          .value((e) => Boolean(e.state.name))
          .onClick((e) => {
            const next = e.state.current.name ? undefined : initial.name;
            e.change((d) => (d.name = next));
          }),
      );

      dev.hr();

      dev.button((btn) =>
        btn.label('theme: Light').onClick((e) => {
          e.change((d) => (d.theme = 'Light'));
          dev.theme('Light');
        }),
      );
      dev.button((btn) =>
        btn.label('theme: Dark').onClick((e) => {
          e.change((draft) => (draft.theme = 'Dark'));
          dev.theme('Dark');
        }),
      );

      dev.hr();

      dev
        .button((btn) => {
          btn.label('expand = 99').onClick((e) => e.change((e) => (e.expand = 99)));
        })
        .button((btn) => {
          btn.label('expand = 1').onClick((e) => e.change((e) => (e.expand = 1)));
        });
    });

    dev.hr();

    dev.section('Data', (dev) => {
      const value = (label: string, data: any) => {
        dev.button(label, (e) => e.change((d) => (d.data = data)));
      };
      value('`undefined`', undefined);
      value('`null`', null);
      dev.hr();
      value('`true`', true);
      value('`123`', 123);
      value('`"Hello"`', 'Hello');
      dev.hr();
      value('`{object}`', initial.data);
      value('`{ }`', {});
      dev.hr();
      value('`[array]`', [1, 'two', { id: 'three' }, [true, 'four', () => null]]);
      value('`[ ]`', []);
    });

    dev.hr();
  });
});
