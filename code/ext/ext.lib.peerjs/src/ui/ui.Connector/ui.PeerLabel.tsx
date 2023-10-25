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

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    error: css({ opacity: 0.5 }),
    body: css({
      Flex: 'x-center-start',
    }),
    prefix: css({
      minWidth: props.prefixWidth,
      marginRight: 3,
      opacity: selected && focused ? 0.6 : 0.3,
    }),
    hash: css({}),
  };

  const elError = error && <div {...styles.error}>{error}</div>;

  const elBody = !error && (
    <div {...styles.body}>
      <div {...styles.prefix}>{`${prefix}:`}</div>
      <div {...styles.hash}>{peerid}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elError}
      {elBody}
    </div>
  );
};
