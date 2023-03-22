import { Textbox, TextboxProps } from '.';
import { t, Dev } from '../../test.ui';
import { DevIcons } from '../Icons.mjs';

type StringOrNil = string | undefined | null;
type ErrorInput = t.DevTextboxError | boolean | undefined | null;

type T = {
  props: TextboxProps;
};
const initial: T = {
  props: {
    isEnabled: Textbox.DEFAULT.isEnabled,
    label: 'My Label',
    // placeholder: null,
  },
};

export default Dev.describe('Textbox', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .display('grid')
      .size([250, null])
      .render<T>((e) => (
        <Textbox {...e.state.props} onChange={(e) => state.change((d) => (d.props.value = e.to))} />
      ));
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Dev.Textbox'} data={e.state} expand={1} />);

    dev.section('Value', (dev) => {
      const value = (value: StringOrNil, label?: string) => {
        dev.button(label ?? `"${value}"`, (e) => e.change((d) => (d.props.value = value)));
      };

      value(undefined, 'undefined');
      value(null, 'null');
      value('', '"" (empty)');
      dev.hr(-1, 5);
      value('Hello 👋');
      value(Dev.Lorem.words(50), 'long (50 words)');
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('enabled')
          .value((e) => e.state.props.isEnabled)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'isEnabled'))),
      );

      dev.boolean((btn) =>
        btn
          .label('label')
          .value((e) => Boolean(e.state.props.label))
          .onClick((e) =>
            e.change((d) => {
              d.props.label = d.props.label ? undefined : 'My Label';
            }),
          ),
      );

      dev.boolean((btn) =>
        btn
          .label((e) =>
            e.state.props.placeholder === null ? 'placeholder: null' : 'placeholder (default)',
          )
          .value((e) => e.state.props.placeholder !== null)
          .onClick((e) =>
            e.change((d) => {
              const next = d.props.placeholder === null ? undefined : null;
              d.props.placeholder = next;
            }),
          ),
      );

      dev.hr(-1, 5);

      const elIcon = <DevIcons.Keyboard style={{ MarginX: 3 }} />;
      dev.boolean((btn) =>
        btn
          .label('left')
          .value((e) => Boolean(e.state.props.left))
          .onClick((e) => e.change((d) => (d.props.left = d.props.left ? undefined : elIcon))),
      );
      dev.boolean((btn) =>
        btn
          .label('right')
          .value((e) => Boolean(e.state.props.right))
          .onClick((e) => e.change((d) => (d.props.right = d.props.right ? undefined : elIcon))),
      );

      dev.hr(-1, 5);

      const error = (value: ErrorInput) => {
        dev.button((btn) =>
          btn
            .label(`error: ${value}`)
            .right((e) => (e.state.props.right === value ? '←' : ''))
            .onClick((e) => e.change((d) => (d.props.error = value))),
        );
      };

      error('error');
      error('warning');
      error(true);
      error(undefined);
    });

    dev.hr(5, 20);

    dev.textbox((txt) =>
      txt
        .enabled((e) => e.state.props.isEnabled)
        .label((e) => e.state.props.label)
        .placeholder((e) => e.state.props.placeholder)
        .left((e) => e.state.props.left)
        .right((e) => e.state.props.right)
        .value((e) => e.state.props.value)
        .error((e) => e.state.props.error)
        .footer((e) =>
          e.state.props.value
            ? 'Comentary on the input value.'
            : 'Here is a hint about what to enter.',
        )
        .onChange((e) => e.change((d) => (d.props.value = e.next)))
        .onEnter((e) => {
          console.info('ENTER', e);
        }),
    );
  });
});
