import { Crdt, CrdtView, Dev, type t } from '../../test.ui';

type TDoc = { ns?: t.CrdtNamespaceMap };

type T = { props: t.CrdtNamespaceProps };
const initial: T = { props: {} };

export default Dev.describe('CrdtNamespace', (e) => {
  const doc = Crdt.ref<TDoc>('test-doc', {});
  const ns = CrdtView.Namespace.ns(doc, (d) => d.ns || (d.ns = {}));

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <CrdtView.Namespace {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        doc: doc.current,
        ns,
      };
      return <Dev.Object name={'Namespace'} data={data} expand={1} />;
    });
  });
});
