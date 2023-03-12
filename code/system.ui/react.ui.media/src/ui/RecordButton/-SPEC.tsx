import { RecordButton, RecordButtonStates } from '.';
import { Dev, rx } from '../../test.ui';
import { dialogFactory, DialogKind, DialogKinds } from './-dev/Dialog';

import type { RecordButtonProps } from '.';

type T = {
  props: RecordButtonProps;
  debug: { dialog: DialogKind };
};

export default Dev.describe('RecordButton', (e) => {
  const bus = rx.bus();
  const initial: T = {
    props: { bus, isEnabled: true, size: 45, state: undefined },
    debug: { dialog: 'hello' },
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject.render<T>((e) => {
      return (
        <RecordButton
          {...e.state.props}
          onClick={(e) => console.log('onClick', e)}
          dialog={{ element: dialogFactory(e.state.debug.dialog) }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('isEnabled')
          .value((e) => e.state.props?.isEnabled)
          .onClick((e) => e.change((e) => (e.props!.isEnabled = !e.props!.isEnabled))),
      );

      dev.button('size: `45`', (e) => e.change((d) => (d.props.size = 45)));
    });

    dev.hr();

    dev.section('Debug', (dev) => {
      RecordButtonStates.forEach((state) => {
        const label = `state: "${state}"`;
        dev.button(label, (e) => e.change((d) => (d.props.state = state)));
      });

      dev.hr();

      DialogKinds.forEach((dialog) => {
        const label = `dialog kind: "${dialog}"`;
        dev.button(label, (e) => e.change((d) => (d.debug.dialog = dialog)));
      });
    });
  });
});
