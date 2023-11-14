import { CrdtInfo, CrdtInfoProps } from '..';
import {
  ConnectionMock,
  Crdt,
  Dev,
  Keyboard,
  TestFilesystem,
  css,
  rx,
  type t,
} from '../../../test.ui';

type T = {
  props: CrdtInfoProps;
  debug: {
    bg: boolean;
    title: boolean;
    message: string;
    logsave: boolean;
    autosave: boolean;
    syncDoc: boolean;
  };
};
const initial: T = {
  props: { card: true },
  debug: { bg: false, title: false, message: '', logsave: false, autosave: true, syncDoc: false },
};

type Doc = { count: number };
const initialDoc: Doc = { count: 0 };

export default Dev.describe('CrdtInfo', async (e) => {
  const bus = rx.bus();
  const fs = (await TestFilesystem.client(bus)).fs;

  const toFs = (path: string) => ({ path, fs: fs.dir('dev.sample/crdt-info') });
  const fsdirs = {
    doc: toFs('dev.crdt-info.sample'),
  };

  type LocalStore = T['debug'] & { fields?: t.CrdtInfoField[]; card?: boolean; flipped?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.Info');
  const local = localstore.object({
    fields: initial.props.fields,
    card: initial.props.card,
    flipped: initial.props.flipped,

    bg: initial.debug.bg,
    title: initial.debug.title,
    message: initial.debug.message,
    logsave: initial.debug.logsave,
    autosave: initial.debug.autosave,
    syncDoc: initial.debug.syncDoc,
  });

  const docid = 'my-doc';
  const docA = Crdt.Doc.ref<Doc>(docid, initialDoc);
  const docB = Crdt.Doc.ref<Doc>(docid, initialDoc);

  const docFile = await Crdt.Doc.file<Doc>(fsdirs.doc.fs, docA, {
    autosave: local.autosave,
    logsave: local.logsave,
  });

  const conns = ConnectionMock();
  const syncDocA = Crdt.Doc.sync<Doc>(conns.a.bus, docA);
  const syncDocB = Crdt.Doc.sync<Doc>(conns.b.bus, docB);

  const Util = {
    props(state: T): CrdtInfoProps {
      const { debug, props } = state;

      const data: t.CrdtInfoData = {
        url: { href: location.href },
        file: { doc: docFile, path: fsdirs.doc.path },
        network: { doc: debug.syncDoc ? syncDocA : undefined },
        history: {
          data: docA.history,
          item: {
            title: 'Latest Change',
            data: docA.history[docA.history.length - 1],
          },
        },
      };

      return {
        ...props,
        title: debug.title ? ['CRDT Document', null] : undefined,
        data,
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
      d.debug.syncDoc = local.syncDoc;
    });

    const redraw = () => ctx.redraw();
    docA.$.subscribe(redraw);
    docFile.$.subscribe(redraw);

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(e.state);
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      ctx.subject.size([320, null]);

      const base = css({ Padding: debug.bg ? [20, 25] : 0 });
      return (
        <div {...base}>
          <CrdtInfo {...props} card={false} />
        </div>
      );
    });
  });

  e.it('keyboard:init', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    Keyboard.on({
      Enter(e) {
        e.handled();
        state.change((d) => {
          local.flipped = Dev.toggle(d.props, 'flipped');
          local.card = d.props.card = true;
        });
      },
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `flipped (← Enter)`)
          .value((e) => Boolean(e.state.props.flipped))
          .onClick((e) => e.change((d) => (local.flipped = Dev.toggle(d.props, 'flipped')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `syncDoc`)
          .value((e) => e.state.debug.syncDoc)
          .onClick((e) => e.change((d) => (local.syncDoc = Dev.toggle(d.debug, 'syncDoc')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('save strategy: file')
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
          .label('save strategy: running log')
          .value((e) => e.state.debug.logsave)
          .onClick((e) =>
            e.change((d) => {
              const next = (local.logsave = Dev.toggle(d.debug, 'logsave'));
              docFile.logging = next;
            }),
          ),
      );

      dev.button('delete file', (e) => docFile.delete());

      dev.hr(-1, [5, 8]);

      dev.title('Change');

      const inc = (by: number) => {
        const commit = state.current.debug.message;
        docA.change(commit, (d) => (d.count += by));
      };

      const count = (label: string, by: number) => {
        dev.button((btn) =>
          btn
            .label(`${label} →`)
            .right((e) => `count = ${docA.current.count} ${by > 0 ? '+ 1' : '- 1'}`)
            .onClick((e) => inc(by)),
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

    dev.hr(0, 10);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <Dev.FieldSelector
            style={{ Margin: [10, 10, 10, 20] }}
            all={CrdtInfo.FIELDS}
            selected={props.fields ?? CrdtInfo.DEFAULTS.fields}
            onClick={(ev) => {
              const fields = ev.next as CrdtInfoProps['fields'];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.section((dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return <CrdtInfo {...props} margin={[15, 25, 40, 25]} />;
      });

      dev.boolean((btn) =>
        btn
          .label((e) => 'as card')
          .value((e) => e.state.props.card)
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'card')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
      );

      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );
    });

    dev.hr(0, 100);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: Util.props(e.state),
        history: docA.history,
        'Doc<T>': docA.current,
      };

      return (
        <Dev.Object
          name={'sys.crdt.Info'}
          data={data}
          expand={{
            paths: ['$', '$.Doc<T>'],
          }}
        />
      );
    });
  });
});
