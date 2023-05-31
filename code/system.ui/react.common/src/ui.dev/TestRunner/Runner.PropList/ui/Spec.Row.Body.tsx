import { useState } from 'react';
import { Button, css, DEFAULTS, Switch, t } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';
import { Util } from '../Util.mjs';
import { RunIcon } from './Specs.Row.RunIcon';

export type BodyProps = {
  data: t.TestRunnerPropListData;
  suite?: t.TestSuiteModel | undefined;
  isSelected?: boolean;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { isSelected, suite } = props;

  const hash = suite?.hash();
  const ellipsis = Wrangle.ellipsis(props);
  const isRunning = Wrangle.isRunning(props, hash);

  const [isOver, setOver] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    left: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 8,
    }),
    ellipsis: css({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    text: css({ paddingTop: 1 }),
  };

  return (
    <Button
      style={css(styles.base, props.style)}
      onClick={props.onClick}
      onMouse={(e) => setOver(e.isOver)}
    >
      <div {...styles.left}>
        <RunIcon isSelected={isSelected} isOver={isOver} isRunning={isRunning} />
        <div {...css(styles.text, ellipsis ? styles.ellipsis : false)}>
          {suite?.description ?? ''}
        </div>
      </div>
    </Button>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  ellipsis(props: BodyProps) {
    const ellipsis = props.data.specs?.ellipsis ?? DEFAULTS.ellipsis;
    return typeof ellipsis === 'function' ? ellipsis() : ellipsis;
  },

  results(props: BodyProps, hash?: string) {
    const results = props.data.specs?.results;
    return results ? results[hash ?? ''] : false;
  },

  isRunning(props: BodyProps, hash?: string) {
    return Wrangle.results(props, hash) === true;
  },
};
