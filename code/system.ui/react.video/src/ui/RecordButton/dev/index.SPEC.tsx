import { Dev, ObjectView, expect, rx, LocalStorage, t } from '../../../test.ui';
import { DevDialog } from './Dialog';
import { RecordButton, RecordButtonStates } from '..';

import type { RecordButtonProps } from '..';

type T = { props: RecordButtonProps };

type DialogKind = 'hello' | 'dev/dialog';
const DialogKinds: DialogKind[] = ['hello', 'dev/dialog'];

type CtxStorage = {
  state: RecordButtonProps['state'];
  size: RecordButtonProps['size'];
  isEnabled: RecordButtonProps['isEnabled'];
  dialog: DialogKind;
};

export default Dev.describe('RecordButton', (e) => {
  const local = LocalStorage<CtxStorage>(`dev:sys.ui.video/RecordButton`);
  const storage = local.object({
    state: 'default',
    size: 45,
    isEnabled: true,
    dialog: 'hello',
  });

  const bus = rx.bus();
  const initial: T = { props: { bus, isEnabled: true } };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.component
      .display('grid')
      // .backgroundColor(1)
      // .size(250, null)
      .render<T>((e) => {
        return <RecordButton {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <ObjectView name={'state'} data={e.state} />);

    dev.boolean((btn) =>
      btn
        .label('isEnabled')
        .value((e) => e.state.props?.isEnabled)
        .onClick((e) => e.change((e) => (e.props!.isEnabled = !e.props!.isEnabled))),
    );
  });
});
