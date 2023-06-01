import { useEffect, useState } from 'react';

import { COLORS, Button, DEFAULTS, DevIcons, css, rx, t, Time } from '../common';
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
  const hash = suite?.hash() ?? '';
  const isRunning = Wrangle.isRunning(props, hash);
  const ellipsis = Wrangle.ellipsis(props);
  const ok = Wrangle.ok(props, hash);

  const [isOver, setOver] = useState(false);
  const [isColored, setColored] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();

    if (typeof ok === 'boolean') {
      setColored(true);
      Time.delay(DEFAULTS.colorDelay, () => {
        if (!life.disposed) setColored(false);
      });
    }

    return life.dispose;
  }, [ok]);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    body: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 8,
    }),
    left: css({}),
    right: css({ paddingTop: 1 }),
    ellipsis: css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
    icon: css({
      float: 'left',
      marginRight: 2,
      color: isColored || isOver ? Wrangle.iconColor(ok) : undefined,
      transition: 'color 0.2s ease-in-out',
    }),
  };

  const elText = <span>{suite?.description ?? ''}</span>;
  const elIcoPassed = ok === true && <DevIcons.Test.Passed size={13} style={styles.icon} />;
  const elIcoFailed = ok === false && <DevIcons.Test.Failed size={13} style={styles.icon} />;

  return (
    <Button
      style={css(styles.base, props.style)}
      onClick={props.onClick}
      onMouse={(e) => setOver(e.isOver)}
    >
      <div {...styles.body}>
        <RunIcon
          isSelected={isSelected}
          isOver={isOver}
          isRunning={isRunning}
          style={styles.left}
        />
        <div {...css(styles.right, ellipsis ? styles.ellipsis : false)}>
          {elIcoPassed}
          {elIcoFailed}
          {elText}
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

  results(props: BodyProps, hash: string) {
    const entry = props.data.specs?.results;
    return entry ? entry[hash] : false;
  },

  isRunning(props: BodyProps, hash: string) {
    return Wrangle.results(props, hash) === true;
  },

  ok(props: BodyProps, hash: string) {
    const results = Wrangle.results(props, hash);
    return typeof results === 'object' ? results.ok : undefined;
  },

  iconColor(ok?: boolean, isOver?: boolean) {
    if (ok === undefined) return COLORS.DARK;
    return ok ? COLORS.GREEN : COLORS.RED;
  },
};
