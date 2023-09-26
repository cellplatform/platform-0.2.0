import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';
import { View } from './ui.Button';

export const Blue: React.FC<t.ButtonProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    blue: css({ color: COLORS.BLUE }),
  };

  return (
    <View style={css(styles.blue, props.style)} {...{ ...props, label: undefined }}>
      {<div {...styles.blue}>{props.label || props.children}</div>}
    </View>
  );
};
