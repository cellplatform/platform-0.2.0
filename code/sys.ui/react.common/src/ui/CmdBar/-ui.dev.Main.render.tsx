import { css } from '../../test.ui';
import { SampleMain } from './-ui.dev.Main';
import { type t } from './common';

export function render(props: {
  cmdbar?: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  argv?: string;
  theme?: t.CommonTheme;
  size?: t.SizeTuple;
  topHalf?: boolean;
  style?: t.CssValue;
}) {
  const { cmdbar, size = [350, 200] } = props;
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      gridTemplateRows: props.topHalf ? `1fr 1fr` : '1fr auto',
    }),
    main: css({ display: 'grid' }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.main}>
        <SampleMain theme={props.theme} size={size} cmd={cmdbar} argv={props.argv} />
      </div>
      <div>{/* Grid Spacer */}</div>
    </div>
  );
}
