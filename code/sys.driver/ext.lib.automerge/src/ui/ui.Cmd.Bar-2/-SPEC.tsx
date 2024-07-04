import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';
import { Button, COLORS, Color, Dev, Doc, Pkg, css, sampleCrdt, type t } from '../../test.ui';

type P = CmdBarStatefulProps;
type T = { props: P; debug: { docuri?: t.UriString; useLens?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = 'Crdt.CmdBar';

export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    useLens: true,
  });

  const db = await sampleCrdt({ broadcastAdapter: true });
  let model: t.RepoListModel;
  let listRef: t.RepoListRef;
  let doc: t.Doc | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.debug.useLens = local.useLens;
      d.debug.docuri = local.docuri;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
    });

    dev.hr(5, 20);

    dev.section('Repo', (dev) => {
      dev.row(async (e) => {
        const docs = db.index.doc.current.docs;
        const styles = {
          base: css({}),
          item: css({
            Padding: [2, 5],
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 600,
            lineHeight: 1.6,
            borderRadius: 3,
          }),
        };

        const select = (uri: string) => {
          state.change((d) => (local.docuri = d.debug.docuri = uri));
        };

        return (
          <div {...styles.base}>
            {docs.map((doc, i) => {
              const label = `crdt:${Doc.Uri.shorten(doc.uri)}`;
              const isSelected = doc.uri === state.current.debug.docuri;
              const backgroundColor = isSelected ? Color.alpha(COLORS.BLUE, 0.1) : undefined;
              return (
                <div key={i} {...css(styles.item, { backgroundColor })}>
                  <Button onClick={() => select(doc.uri)}>{label}</Button>
                </div>
              );
            })}
          </div>
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props, debug } = e.state;
      const data = {
        docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
        props,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
