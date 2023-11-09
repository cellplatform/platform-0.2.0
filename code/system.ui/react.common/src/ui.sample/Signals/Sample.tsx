import { css, effect, type Signal, type t, RenderCount } from './common';

export type SampleProps = {
  counter: Signal<number>;
  style?: t.CssValue;
};

/**
 * https://github.com/preactjs/signals
 * https://preactjs.com/guide/v10/signals/
 */
export const Sample: React.FC<SampleProps> = (props) => {
  const { counter } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ Padding: [15, 30, 15, 24] }),
    label: css({ fontSize: 32 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <RenderCount absolute={[-20, 0, null, null]} opacity={0.2} />
      <div {...styles.label}>{`🐷 count: ${counter.value}`}</div>
    </div>
  );
};
