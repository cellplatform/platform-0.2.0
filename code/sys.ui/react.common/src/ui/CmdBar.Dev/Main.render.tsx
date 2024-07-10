import { SampleMain } from './Main';
import { css, type t } from './common';

export function render(props: {
  cmdbar?: t.CmdBarRef | t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  argv?: string;
  theme?: t.CommonTheme;
  size?: t.SizeTuple;
  focused?: { cmdbar?: boolean };
  topHalf?: boolean;
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
          argv={props.argv}
        />
      </div>
      <div>{/* Spacer */}</div>
    </div>
  );
}
