import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';
import { MarkdownOutline } from '../Markdown.Outline/index.mjs';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent fermentum, augue ut porta varius, eros nisl euismod ante, ac suscipit elit libero nec dolor. Morbi magna enim, molestie non arcu id, varius sollicitudin neque. In sed quam mauris. Aenean mi nisl, elementum non arcu quis, ultrices tincidunt augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla eu purus id dolor auctor suscipit. Integer lacinia sapien at ante tempus volutpat.';

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;

  style?: t.CssValue;
};

export const MarkdownDoc: React.FC<MarkdownDocProps> = (props) => {
  const { markdown, scroll: Scroll } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ Scroll, Flex: 'y-stretch-stretch' }),
    body: {
      base: css({ flex: 1, Flex: 'x-stretch-stretch' }),
      left: { position: 'relative' },
      main: css({
        flex: 1,
        position: 'relative',
        padding: 20,
        PaddingX: 40,
        boxSizing: 'border-box',
      }),
    },
    footer: {
      base: css({}),
      inner: css({ height: 100 }),
    },
    outline: css({
      marginTop: 20,
      marginLeft: 20,
    }),
  };

  const elBody = (
    <div {...styles.body.base}>
      <div {...styles.body.left}>
        <MarkdownOutline markdown={markdown} style={styles.outline} />
      </div>
      <div {...styles.body.main}>
        {Array.from({ length: 4 }).map((v, i) => {
          return (
            <p key={i}>
              {i}. {LOREM}
            </p>
          );
        })}
      </div>
    </div>
  );

  const elFooter = (
    <div {...styles.footer.base}>
      <div {...styles.footer.inner} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elFooter}
    </div>
  );
};
