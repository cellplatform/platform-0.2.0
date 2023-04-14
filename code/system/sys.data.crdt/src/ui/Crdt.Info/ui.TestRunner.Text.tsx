import { useEffect, useRef, useState } from 'react';
import { COLORS, css, Icons, t, Time } from './common';

export type TextProps = {
  results?: t.TestSuiteRunResponse;
  style?: t.CssValue;
};

export const Text: React.FC<TextProps> = (props) => {
  const { results } = props;
  if (!results) return <div>{'run tests'}</div>;

  const { stats } = results;
  const { passed, failed } = stats;
  const skipped = stats.skipped + stats.only;
  const elapsed = Time.duration(results.elapsed);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    item: css({ Flex: 'x-center-center' }),
    failed: css({ color: COLORS.RED }),
    passed: css({ color: COLORS.GREEN }),
    skipped: css({ color: COLORS.YELLOW }),
    elapsed: css({}),
    spacer: css({ width: 6 }),
  };

  const items: JSX.Element[] = [];
  const push = (el: JSX.Element) => {
    if (items.length > 0) items.push(<div {...styles.spacer} key={`s-${items.length}`} />);
    items.push(el);
  };

  if (failed > 0) {
    const title = `${failed} failed`;
    push(
      <div {...css(styles.failed, styles.item)} key={title} title={title}>
        <Icons.Test.Failed size={14} /> {failed}
      </div>,
    );
  }

  if (passed > 0) {
    const title = `${passed} passed`;
    push(
      <div {...css(styles.passed, styles.item)} key={title} title={title}>
        <Icons.Test.Passed size={14} /> {passed}
      </div>,
    );
  }

  if (skipped > 0) {
    const title = `${skipped} skipped`;
    push(
      <div {...css(styles.skipped, styles.item)} key={title} title={title}>
        <Icons.Test.Skipped size={14} style={{ transform: 'scaleX(-1)' }} /> {skipped}
      </div>,
    );
  }

  if (elapsed.msec > 0) {
    const title = 'Re-run tests';
    push(
      <div
        {...css(styles.elapsed, styles.item)}
        key={'elapsed'}
        title={title}
      >{`in ${elapsed}`}</div>,
    );
  }

  return <div {...css(styles.base, props.style)}>{items}</div>;
};
