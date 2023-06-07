import 'symbol-observable';

import { useEffect } from 'react';

import { Color, COLORS, css, State, t } from '../common';
import { History } from '../History';
import { Markdown } from '../Markdown';
import { env } from '../Root.env';
import { RootTitle } from './Root.Title';

const { instance } = env;

/**
 * Component
 */
export type RootProps = {
  showEditor?: boolean;
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const { showEditor = false } = props;
  const state = State.useState(instance);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    /**
     * TODO 🐷
     * - Have the state instance passed in somehow
     *   Not as implicity in the environment (as a singleton which it is now [DEV-MODE])
     */
    const events = State.Bus.Events({ instance });
    events.init();

    /**
     * End of life.
     */
    return events.dispose();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    normalize: css({ fontFamily: 'sans-serif', color: COLORS.DARK }),
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      boxSizing: 'border-box',
    }),
    left: css({
      flex: 1,
      Flex: 'y-stretch-stretch',
    }),
    right: css({
      width: 200,
      borderLeft: `solid 1px ${Color.format(-0.1)}`,
    }),

    /**
     * Content
     */
    history: { flex: 1 },
    body: css({ position: 'relative', flex: 1 }),
  };

  const elLeft = (
    <div {...styles.left}>
      {showEditor && <RootTitle text={'Content Bundle (Report)'} />}
      <div {...styles.body}>
        <Markdown instance={instance} showEditor={showEditor} style={{ Absolute: 0 }} />
      </div>
    </div>
  );

  const elRight = showEditor && (
    <div {...styles.right}>
      <History instance={instance} style={styles.history} data={state.current?.log} />
    </div>
  );

  return (
    <div {...css(styles.base, styles.normalize, props.style)}>
      {elLeft}
      {elRight}
    </div>
  );
};
