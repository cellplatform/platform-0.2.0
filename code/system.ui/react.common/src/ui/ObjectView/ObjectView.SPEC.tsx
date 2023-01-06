import { Dev } from '../../test.ui';
import { ObjectView } from '.';
import type { ObjectViewProps as T } from '.';

export default Dev.describe('ObjectView', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .backgroundColor(1)
      .size(350, null)
      .render<T>((e) => <ObjectView {...e.state} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e);
    dev.button((btn) =>
      btn.label('set data').onClick((e) => e.state.change((draft) => (draft.data = { foo: 123 }))),
    );
  });
});
