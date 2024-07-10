import { SampleMain, type SampleProps } from './Main';
import { css, type t } from './common';

export function render(props: {
  cmdbar?: t.CmdBarRef | t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  topHalf?: boolean;
  argv?: SampleProps['argv'];
  size?: SampleProps['size'];
  title?: SampleProps['title'];
  focused?: SampleProps['focused'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
}) {
  const { cmdbar, size } = props;
  const gridTemplateRows = props.topHalf ? `1fr 1fr` : '1fr auto';
  const styles = {
    base: css({ Absolute: 0, display: 'grid', gridTemplateRows }),
    main: css({ display: 'grid' }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.main}>
        <SampleMain
          theme={props.theme}
          size={size}
          ctrl={cmdbar}
          focused={props.focused}
          title={props.title}
          argv={props.argv}
        />
      </div>
      <div>{/* Spacer */}</div>
    </div>
  );
}
