import { useEffect, useRef } from 'react';
import { css, t } from '../../common';

type Size = { width: number; height: number };

export type ComponentProps = t.MeasureSizeStyle & {
  content?: React.ReactNode;
  style?: t.CssValue;
  onReady?: (size: Size) => void;
};

export const Component: React.FC<ComponentProps> = (props) => {
  const { fontFamily, fontSize, fontWeight, fontStyle } = props;
  const { lineHeight, letterSpacing, width } = props;
  const baseRef = useRef<HTMLDivElement>(null);

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const el = baseRef.current;
    const width = el?.offsetWidth ?? -1;
    const height = el?.offsetHeight ?? -1;
    const size = { width, height };
    props.onReady?.(size);
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Absolute: [-999999, null, null, -999999] }),
    inner: css({
      display: 'inline-block',
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      lineHeight,
      letterSpacing,
      width,
    }),
  };
  return (
    <div ref={baseRef} {...css(styles.base, props.style)} className={'tmp.MeasureSize'}>
      <div {...styles.inner}>{props.content}</div>
    </div>
  );
};
