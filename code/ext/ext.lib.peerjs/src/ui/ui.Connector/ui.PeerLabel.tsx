import { css, type t } from './common';

export type PeerLabelProps = {
  uri?: string;
  prefixWidth?: number;
  selected?: boolean;
  focused?: boolean;
  style?: t.CssValue;
};

export const PeerLabel: React.FC<PeerLabelProps> = (props) => {
  const { uri = '', selected, focused } = props;

  let error = '';
  const [prefix, peerid = ''] = uri.split(':');
  if (!peerid) error = '(error: no peer)';

  const length = 4;
  const hashLeft = peerid.slice(0, length);
  const hashRight = peerid.slice(length);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    error: css({ opacity: 0.5 }),
    body: css({
      Flex: 'x-center-start',
    }),
    prefix: css({ minWidth: props.prefixWidth, marginRight: 3 }),
    hashLeft: css({}),
    hashRight: css({ opacity: selected && focused ? 0.3 : 0.15 }),
  };

  const elError = error && <div {...styles.error}>{error}</div>;

  const elBody = !error && (
    <div {...styles.body}>
      <div {...styles.prefix}>{`${prefix}:`}</div>
      <div {...styles.hashLeft}>{hashLeft}</div>
      <div {...styles.hashRight}>{hashRight}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elError}
      {elBody}
    </div>
  );
};
