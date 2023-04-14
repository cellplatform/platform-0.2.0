import { css, DEFAULTS, Icons, t } from './common';

export type TestLabelProps = {
  style?: t.CssValue;
};

export const TestLabel: React.FC<TestLabelProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    link: css({ marginLeft: 4 }),
  };

  const tooltip = 'Show test runner in full-screen mode.';
  const elInfo = (
    <a
      href={Href.tests}
      {...styles.link}
      target={'_blank'}
      rel={'noopener noreferrer'}
      title={tooltip}
    >
      <Icons.Info size={14} color={-0.3} />
    </a>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div>{'Verify'}</div>
      {elInfo}
    </div>
  );
};

/**
 * Helpers
 */
const Href = {
  get tests() {
    const url = new URL(location.origin);
    url.searchParams.set(DEFAULTS.query.dev, 'sys.crdt.tests');
    return url.href;
  },
};
