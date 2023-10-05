import { chromeDark, chromeLight, ObjectInspector } from 'react-inspector';

import { css, FC, type t } from '../common';
import { DEFAULTS } from './DEFAULT.mjs';
import { renderer } from './Renderer';

const View: React.FC<t.ObjectViewProps> = (props) => {
  const {
    name,
    data,
    sortObjectKeys,
    showNonenumerable = DEFAULTS.showNonenumerable,
    showRootSummary = DEFAULTS.showRootSummary,
    fontSize = DEFAULTS.font.size,
  } = props;
  const { expandLevel, expandPaths } = Wrangle.expand(props);

  const styles = {
    base: css({
      position: 'relative',
      fontSize,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ObjectInspector
        name={name}
        data={data}
        fontsize={fontSize}
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
  theme(props: t.ObjectViewProps) {
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

  baseTheme(theme?: t.ObjectViewTheme) {
    theme = theme ?? DEFAULTS.theme;
    if (theme === 'Light') return chromeLight;
    if (theme === 'Dark') return chromeDark;
    throw new Error(`Theme '${theme}' not supported.`);
  },

  expand(props: t.ObjectViewProps) {
    const { expand } = props;
    let expandLevel: number | undefined = undefined;
    let expandPaths: string[] | undefined;

    if (typeof expand === 'number') {
      expandLevel = expand;
    }

    if (typeof expand === 'object') {
      expandLevel = expand.level;
      expandPaths = Array.isArray(expand.paths) ? expand.paths : undefined;
    }

    return { expandLevel, expandPaths };
  },
};

/**
 * [Export]
 */

type Fields = { DEFAULTS: typeof DEFAULTS };
export const ObjectView = FC.decorate<t.ObjectViewProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ObjectView' },
);
