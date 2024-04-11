import { QRCode, QRCodeProps } from '.';
import { Dev } from '../../test.ui';
import { TextInput } from '../Text.Input';

type T = { props: QRCodeProps };
const initial: T = {
  props: {
    value: 'https://www.youtube.com/watch?v=nlyYDuSdU38',
    size: QRCode.DEFAULT.size,
  },
};

export default Dev.describe('QRCode', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject.display('grid').render<T>((e) => {
      return <QRCode {...e.state.props} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.section('Size', (dev) => {
      const size = (value: number, suffix?: string) => {
        const label = `${value} px ${suffix ?? ''}`.trim();
        dev.button(label, (e) => e.change((d) => (d.props.size = value)));
      };

      size(80);
      size(QRCode.DEFAULT.size, '(default)');
      size(200);
    });

    dev.hr();

    dev.section('Value', (dev) => {
      dev.row((e) => {
        return (
          <TextInput
            value={e.state.props.value}
            placeholder={'value (eg. URL)'}
            placeholderStyle={{ opacity: 0.3, italic: true }}
            onChange={(e) => dev.change((d) => (d.props.value = e.to))}
          />
        );
      });

      const value = (title: string, value: string = title) => {
        dev.button(`value: ${title}`, async (e) => {
          dev.change((d) => (d.props.value = value));
        });
      };

      dev.hr();

      value('(empty)', '');
      value('"Hello, World! 👋"', 'Hello, World! 👋');
      value('YouTube: Baby Elephant', 'https://www.youtube.com/watch?v=nlyYDuSdU38');
      value('Current URL (location.href)', window.location.href);
    });
  });
});
