import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Color, COLORS, css, rx, FC, type t, TextInput, Icons, Style } from './common';

export const CrdtNsItem: React.FC<t.CrdtNsItemProps> = (props) => {
  const {
    data,
    enabled = DEFAULTS.enabled,
    selected = DEFAULTS.item.selected,
    indent = DEFAULTS.item.indent,
    padding = DEFAULTS.item.padding,
  } = props;
  if (!data) return '⚠️ Not set: { data }';
  if (data.ns?.disposed) return '⚠️ Disposed: { data: { ns } }';

  const value = props.namespace;
  const hasValue = Boolean(value);

  /**
   * [Render]
   */
  const foreColor = selected ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: selected ? COLORS.BLUE : undefined,
      boxSizing: 'border-box',
      ...Style.toPadding(props.padding ?? padding),
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    right: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: 5,
    }),
    centerChild: css({ display: 'grid', placeItems: 'center' }),
    textbox: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.centerChild}>
          <Icons.Repo
            size={18}
            color={Color.alpha(foreColor, hasValue ? 1 : 0.4)}
            offset={[0, 1]}
          />
        </div>
        <TextInput
          style={styles.textbox}
          placeholder={'namespace'}
          placeholderStyle={{
            opacity: 0.3,
            color: foreColor,
            disabledColor: foreColor,
          }}
          value={value}
          valueStyle={{
            fontSize: 13,
            color: foreColor,
            disabledColor: foreColor,
          }}
          maxLength={data.maxLength ?? DEFAULTS.data.maxLength}
          spellCheck={false}
          isEnabled={enabled}
          onChanged={(e) => data.onChange?.({ data, namespace: e.to })}
        />
        <div {...styles.right}>
          <div {...styles.centerChild}>
            <Icons.Json size={17} color={Color.alpha(foreColor, 1)} />
          </div>
          <div {...styles.centerChild}>
            <Icons.ObjectTree size={17} color={Color.alpha(foreColor, 1)} />
          </div>
        </div>
      </div>
    </div>
  );
};
