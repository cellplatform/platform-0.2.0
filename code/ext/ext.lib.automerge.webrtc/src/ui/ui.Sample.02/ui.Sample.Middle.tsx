import { css, type t } from './common';
import { Footer } from './ui.Sample.Middle.Footer';

export type SampleMiddleProps = {
  isConnected?: boolean;
  style?: t.CssValue;
};

export const SampleMiddle: React.FC<SampleMiddleProps> = (props) => {
  const { isConnected } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateRows: '1fr auto' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <Footer isConnected={isConnected} />
    </div>
  );
};
