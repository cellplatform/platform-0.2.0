import { CrdtInfo, CrdtInfoProps } from '.';
import { Color, Crdt, Dev, PropList, t } from '../../test.ui';

type T = {
  props: CrdtInfoProps;
  debug: { bg: boolean };
};
const initial: T = {
  props: {},
  debug: { bg: false },
};

export default Dev.describe('CrdtInfo', (e) => {
  type Doc = { count: number };
  const initialDoc: Doc = { count: 0 };
  const doc = Crdt.Doc.ref<Doc>(initialDoc);

  type LocalStore = { bg: boolean; fields?: t.CrdtInfoFields[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.CrdtInfo');
  const local = localstore.object({ bg: initial.debug.bg, fields: initial.props.fields });

  const Util = {
    props(state: T): CrdtInfoProps {
      return {
        ...state.props,
        data: {
          history: {
            item: {
              data: doc.history[doc.history.length - 1],
              title: 'Latest Change',
            },
          },
        },
      };
    },
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.bg = local.bg;
      d.props.fields = local.fields;
    });
    doc.$.subscribe(() => ctx.redraw());

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(e.state);
      return (
        <CrdtInfo
          {...props}
          padding={debug.bg ? [20, 25] : 0}
          style={{
            width: debug.bg ? 300 : 250,
            backgroundColor: Color.format(debug.bg ? 1 : 0),
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.hr(-1, 5);
      const change = (by: number) => doc.change(dev.lorem(50), (d) => (d.count += by));
      dev.button('increment', (e) => change(1));
      dev.button('decrement', (e) => change(-1));
    });

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 10, 0, 25] }}
            all={CrdtInfo.FIELDS}
            selected={props.fields ?? CrdtInfo.DEFAULTS.fields}
            onClick={(ev) => {
              let fields = ev.next as CrdtInfoProps['fields'];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, 30);

    dev.section('Component', (dev) => {
      dev.hr(0, 5);
      dev.row((e) => {
        const props = Util.props(e.state);
        return <CrdtInfo {...props} style={{ Margin: [0, 10, 0, 10] }} />;
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: Util.props(e.state),
        'Doc<T>': doc.current,
        history: doc.history,
      };

      return (
        <Dev.Object
          name={'dev.CrdtHistory'}
          data={data}
          expand={{
            paths: ['$', '$.Doc<T>'],
          }}
        />
      );
    });
  });
});
