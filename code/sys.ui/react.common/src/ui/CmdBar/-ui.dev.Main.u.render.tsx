import { SampleMain } from './-ui.dev.Main';
import { css, type t } from './common';

export function render(props: {
  cmdbar?: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  argv?: string;
  theme?: t.CommonTheme;
  size?: t.SizeTuple;
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
        <SampleMain theme={props.theme} size={size} cmdbar={cmdbar} argv={props.argv} />
      </div>
      <div>{/* Spacer */}</div>
    </div>
  );
}
