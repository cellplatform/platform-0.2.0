import { chromeDark, chromeLight, ObjectInspector } from 'react-inspector';

import { css, FC, t } from '../common';
import { DEFAULTS } from './DEFAULT.mjs';
import { renderer } from './Renderer';

import type { ObjectViewTheme } from './types.mjs';

export type ObjectViewProps = {
  name?: string;
  data?: any;
  expand?: number | { level?: number; paths?: string[] };
  showNonenumerable?: boolean;
  showRootSummary?: boolean;
  sortObjectKeys?: boolean;
  fontSize?: number;
  theme?: ObjectViewTheme;
  style?: t.CssValue;
};

const View: React.FC<ObjectViewProps> = (props) => {
  const {
    name,
    data,
    showNonenumerable = DEFAULTS.showNonenumerable,
    showRootSummary = DEFAULTS.showRootSummary,
    sortObjectKeys,
  } = props;
  const { expandLevel, expandPaths } = Wrangle.expand(props);

  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ObjectInspector
        name={name}
        data={data}
        showNonenumerable={showNonenumerable}
        nodeRenderer={renderer({ showRootSummary })}
        sortObjectKeys={sortObjectKeys}
        theme={Wrangle.theme(props) as any}
        expandLevel={expandLevel}
        expandPaths={expandPaths}
      />
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  theme(props: ObjectViewProps) {
    const fontSize = `${props.fontSize ?? DEFAULTS.font.size}px`;
    const lineHeight = '1.5em';
    return {
      ...Wrangle.baseTheme(props.theme),
      BASE_BACKGROUND_COLOR: 'transparent',
      BASE_FONT_SIZE: fontSize,
      TREENODE_FONT_SIZE: fontSize,
      BASE_LINE_HEIGHT: lineHeight,
      TREENODE_LINE_HEIGHT: lineHeight,
    };
  },
  baseTheme(theme?: ObjectViewTheme) {
    theme = theme ?? DEFAULTS.theme;
    if (theme === 'Light') return chromeLight;
    if (theme === 'Dark') return chromeDark;
    throw new Error(`Theme '${theme}' not supported.`);
  },
  expand(props: ObjectViewProps) {
    const { expand } = props;
    let expandLevel: number | undefined = undefined;
    let expandPaths: string[] | undefined;

    if (typeof expand === 'number') {
      expandLevel = expand;
    }

    if (typeof expand === 'object') {
      expandLevel = expand.level;
      expandPaths = expand.paths;
    }

    return { expandLevel, expandPaths };
  },
};

/**
 * [Export]
 */

type Fields = { DEFAULTS: typeof DEFAULTS };
export const ObjectView = FC.decorate<ObjectViewProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ObjectView' },
);
