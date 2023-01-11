import React from 'react';
import { DevActions } from 'sys.ui.dev';

import { TextSyntax, TextSyntaxProps } from '..';
import { COLORS, css } from '../common';

type Ctx = {
  props: TextSyntaxProps;
  debug: {
    repeat: number;
    customColors: boolean;
    fixedWidth: boolean;
    textAsChildren: boolean;
  };
};

/**
 * Actions
 */
export const actions = DevActions<Ctx>()
  .namespace('ui.Text.Syntax')
  .context((e) => {
    if (e.prev) return e.prev;
    const ctx: Ctx = {
      props: {
        text: 'hello, <Component>.',
        inlineBlock: true,
        ellipsis: true,
        theme: 'Light',
        fontSize: 16,
        fontWeight: 'bold',
        monospace: true,
      },
      debug: {
        repeat: 1,
        customColors: false,
        fixedWidth: false,
        textAsChildren: false,
      },
    };
    return ctx;
  })

  .init(async (e) => {
    const { ctx, bus } = e;
  })

  .items((e) => {
    e.title('Props');

    e.boolean('inlineBlock', (e) => {
      if (e.changing) e.ctx.props.inlineBlock = e.changing.next;
      e.boolean.current = e.ctx.props.inlineBlock;
    });

    e.boolean('ellipsis', (e) => {
      if (e.changing) e.ctx.props.ellipsis = e.changing.next;
      e.boolean.current = e.ctx.props.ellipsis;
    });

    e.select((config) => {
      config
        .view('buttons')
        .items(TextSyntax.THEMES.map((value) => ({ label: `theme: ${value}`, value })))
        .initial(config.ctx.props.theme)
        .pipe((e) => {
          if (e.changing) e.ctx.props.theme = e.changing?.next[0].value;
        });
    });

    e.hr(1, 0.1);

    e.boolean('monospace', (e) => {
      if (e.changing) e.ctx.props.monospace = e.changing.next;
      e.boolean.current = e.ctx.props.monospace;
    });

    e.boolean('bold', (e) => {
      if (e.changing) e.ctx.props.fontWeight = e.changing.next ? 'bold' : 'normal';
      e.boolean.current = e.ctx.props.fontWeight === 'bold';
    });

    e.select((config) => {
      config
        .title('fontSize')
        .items([12, 14, 16, 24, 36])
        .initial(config.ctx.props.fontSize)
        .view('buttons')
        .pipe((e) => {
          if (e.changing) e.ctx.props.fontSize = e.changing?.next[0].value;
        });
    });

    e.hr();
  })

  .items((e) => {
    e.title('Text');

    const add = (text: string, value = text) => {
      e.button(text, (e) => (e.ctx.props.text = value));
    };

    e.boolean('fixed width', (e) => {
      if (e.changing) e.ctx.debug.fixedWidth = e.changing.next;
      e.boolean.current = e.ctx.debug.fixedWidth;
    });

    e.select((config) => {
      config
        .title('text as')
        .items(['children', { label: 'text={"property"}', value: 'text' }])
        .initial('text')
        .view('buttons')
        .pipe((e) => {
          if (e.changing) {
            const value = e.changing?.next[0].value;
            e.ctx.debug.textAsChildren = value === 'children';
          }
        });
    });

    // e.boolean('as child', (e) => {
    //   if (e.changing) e.ctx.debug.fixedWidth = e.changing.next;
    //   e.boolean.current = e.ctx.debug.fixedWidth;
    // });

    e.hr(1, 0.1);

    add('"" (empty)', '');
    add('hello, <Component>.');
    e.hr(1, 0.1);
    add('<Component>');
    add('{Object}');
    add('[List]');
    add('foo:bar');
    add('<foo:bar>');
    add('{One} <Two> foo:bar [List]');
    e.hr(1, 0.1);
    add('short: "my plain text."');
    add(
      'long: "Lorem ipsum..."',
      '<Lorem> {ipsum} dolor:sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent fermentum, augue ut porta varius, eros nisl euismod ante, ac suscipit elit libero nec dolor. Morbi magna enim, molestie non arcu id, varius sollicitudin neque.',
    );

    e.hr();
  })

  .items((e) => {
    e.title('Debug');

    e.select((config) => {
      config
        .view('buttons')
        .title('repeat')
        .items([1, 2, 3])
        .initial(config.ctx.debug.repeat)
        .pipe((e) => {
          if (e.changing) e.ctx.debug.repeat = e.changing?.next[0].value;
        });
    });

    e.boolean('customColors', (e) => {
      if (e.changing) e.ctx.debug.customColors = e.changing.next;
      e.boolean.current = e.ctx.debug.customColors;
    });

    e.hr();
  })

  .subject((e) => {
    const { props, debug } = e.ctx;
    const { inlineBlock } = props;

    const theme = props.theme ?? TextSyntax.DEFAULT.THEME;
    const isLight = theme === 'Light';

    e.settings({
      host: { background: isLight ? -0.04 : COLORS.DARK },
      layout: {
        cropmarks: isLight ? -0.2 : 0.6,
        labelColor: isLight ? -0.5 : 0.8,
      },
    });

    const styles = {
      base: css({ width: debug.fixedWidth ? 300 : undefined }),
      multi: css({
        marginRight: inlineBlock ? 8 : 0,
        ':last-child': { marginRight: 0 },
      }),
    };

    const elements = Array.from({ length: debug.repeat }).map((v, i) => {
      const style = css(styles.base, debug.repeat > 1 ? styles.multi : undefined);
      const colors = debug.customColors ? { Brace: 'orange' } : undefined;

      return (
        <TextSyntax
          {...props}
          key={i}
          style={style}
          colors={colors}
          text={debug.textAsChildren ? undefined : props.text}
        >
          {debug.textAsChildren ? props.text : undefined}
        </TextSyntax>
      );
    });

    e.render(<div>{elements}</div>);
  });

export default actions;
