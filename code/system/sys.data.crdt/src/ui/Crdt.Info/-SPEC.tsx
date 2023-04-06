import { CrdtInfo, CrdtInfoProps } from '.';
import { Card, Color, Crdt, Dev, PropList, t, rx, getTestFs } from '../../test.ui';

type T = {
  props: CrdtInfoProps;
  debug: { bg: boolean; message: string; logsave: boolean; autosave: boolean };
};
const initial: T = {
  props: {},
  debug: { bg: false, message: '', logsave: false, autosave: true },
};

type Doc = { count: number };
const initialDoc: Doc = { count: 0 };

export default Dev.describe('CrdtInfo', async (e) => {
  const bus = rx.bus();
  const fs = await getTestFs(bus);
  const fsdirs = {
    doc: fs.dir('dev.CrdtInfo.doc'),
  };

  type LocalStore = T['debug'] & { fields?: t.CrdtInfoFields[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.CrdtInfo');
  const local = localstore.object({
    fields: initial.props.fields,
    bg: initial.debug.bg,
    message: initial.debug.message,
    logsave: initial.debug.logsave,
    autosave: initial.debug.autosave,
  });

  const doc = Crdt.Doc.ref<Doc>(initialDoc);
  const docFile = await Crdt.Doc.file<Doc>(fsdirs.doc, doc, {
    autosave: local.autosave,
    logsave: local.logsave,
  });

  const Util = {
    props(state: T): CrdtInfoProps {
      return {
        ...state.props,
        data: {
          file: { data: docFile },
          history: {
            data: doc.history,
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
      d.props.fields = local.fields;
      d.debug.bg = local.bg;
      d.debug.logsave = local.logsave;
      d.debug.autosave = local.autosave;
    });

    const redraw = () => ctx.redraw();
    doc.$.subscribe(redraw);
    docFile.$.subscribe(redraw);

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
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('save: file')
          .value((e) => e.state.debug.autosave)
          .onClick((e) =>
            e.change((d) => {
              const next = (local.autosave = Dev.toggle(d.debug, 'autosave'));
              docFile.autosaving = next;
            }),
          ),
      );

      dev.boolean((btn) =>
        btn
          .label('save: logging')
          .value((e) => e.state.debug.logsave)
          .onClick((e) =>
            e.change((d) => {
              const next = (local.logsave = Dev.toggle(d.debug, 'logsave'));
              docFile.logging = next;
            }),
          ),
      );

      dev.button('delete file', (e) => docFile.delete());

      dev.hr(-1, 5);

      const inc = (by: number) => {
        const message = state.current.debug.message;
        doc.change(message, (d) => (d.count += by));
      };

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => `${doc.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => doc.change((d) => (d.count += by))),
        );
      };

      count('increment', 1);
      count('decrement', -1);

      dev.textbox((txt) =>
        txt
          .placeholder('optional commit message')
          .value((e) => e.state.debug.message)
          .margin([10, 0, 10, 0])
          .onChange((e) => e.change((d) => (d.debug.message = e.to.value)))
          .onEnter((e) => inc(1)),
      );
    });

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 25, 0, 25] }}
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
        return (
          <Card margin={[5, 25, 40, 25]} padding={[25]} shadow={true}>
            <CrdtInfo {...props} />
          </Card>
        );
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
          name={'Crdt.Info'}
          data={data}
          expand={{
            paths: ['$', '$.Doc<T>'],
          }}
        />
      );
    });
  });
});
