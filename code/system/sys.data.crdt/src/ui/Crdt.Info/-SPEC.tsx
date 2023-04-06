import { CrdtInfo, CrdtInfoProps } from '.';
import { Crdt, css, Dev, getTestFs, PropList, rx, t } from '../../test.ui';

type T = {
  props: CrdtInfoProps;
  debug: { bg: boolean; title: boolean; message: string; logsave: boolean; autosave: boolean };
};
const initial: T = {
  props: { card: true },
  debug: { bg: false, title: false, message: '', logsave: false, autosave: true },
};

type Doc = { count: number };
const initialDoc: Doc = { count: 0 };

export default Dev.describe('CrdtInfo', async (e) => {
  const bus = rx.bus();
  const fs = await getTestFs(bus);
  const fsdirs = {
    doc: fs.dir('dev.CrdtInfo.doc'),
  };

  type LocalStore = T['debug'] & { fields?: t.CrdtInfoFields[]; card?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.CrdtInfo');
  const local = localstore.object({
    fields: initial.props.fields,
    card: initial.props.card,

    bg: initial.debug.bg,
    title: initial.debug.title,
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
        title: state.debug.title ? ['Left Title', 'Right Title'] : undefined,
        data: {
          file: { data: docFile },
          history: {
            data: doc.history,
            item: {
              title: 'Latest Change',
              data: doc.history[doc.history.length - 1],
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
      d.props.card = local.card;
      d.debug.bg = local.bg;
      d.debug.title = local.title;
      d.debug.logsave = local.logsave;
      d.debug.autosave = local.autosave;
    });

    const redraw = () => ctx.redraw();
    doc.$.subscribe(redraw);
    docFile.$.subscribe(redraw);

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(e.state);

      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      const base = css({ Padding: debug.bg ? [20, 25] : 0 });

      return (
        <div {...base}>
          <CrdtInfo {...props} card={false} />
        </div>
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

      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
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

    dev.section((dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <CrdtInfo {...props} margin={[15, 25, 30, 25]} />
          // <Card margin={[15, 25, 30, 25]} padding={[25]} shadow={true}>
          // </Card>
        );
      });

      dev.hr(-1, 5);
      dev.boolean((btn) =>
        btn
          .label((e) => 'as card')
          .value((e) => e.state.props.card)
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'card')))),
      );
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
