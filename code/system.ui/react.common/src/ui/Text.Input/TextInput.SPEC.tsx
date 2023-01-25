import { TextInput } from '.';
import { Dev, t } from '../../test.ui';
import { DevSample } from './-dev/DEV.Sample';

type T = {
  props: t.TextInputProps;
  debug: {
    render: boolean;
    isNumericMask: boolean;
    status?: t.TextInputStatus;
    hint: boolean;
    updateHandlerEnabled: boolean;
  };
};

const initial: T = {
  props: { placeholder: 'foobar' },
  debug: {
    render: true,
    isNumericMask: false,
    hint: true,
    updateHandlerEnabled: true,
  },
};

export default Dev.describe('TextInput', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);

    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .size(250, null)
      .render<T>((e) => {
        const { debug } = e.state;
        if (!debug.render) return null;

        const mask = debug.isNumericMask ? TextInput.Masks.isNumeric : undefined;
        const props = { ...e.state.props, mask };
        return <DevSample props={props} debug={debug} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'TextInput'} data={e.state} expand={1} />);
  });
});
