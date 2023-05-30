import { Util } from '../Util.mjs';
import { Button, css, t } from '../common';

export type SpecsResetProps = {
  data: t.TestRunnerPropListData;
  style?: t.CssValue;
};

export const SpecsReset: React.FC<SpecsResetProps> = (props) => {
  const handleResetClick = (e: React.MouseEvent) => {
    const specs = props.data?.specs ?? {};
    const modifiers = Util.modifiers(e);
    specs.onReset?.({ modifiers });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={handleResetClick}>{'reset'}</Button>
    </div>
  );
};
