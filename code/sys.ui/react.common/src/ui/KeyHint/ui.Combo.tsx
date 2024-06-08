import { css, type t } from './common';
import { View as Key } from './ui';

export const Combo: React.FC<t.KeyHintComboProps> = (props) => {
  const { keys = [], parse, os, theme } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(${keys.length}, auto)`,
      columnGap: '3px',
    }),
  };

  const elKeys = keys.map((text, i) => {
    return (
      <Key
        //
        key={`${text}.${i}`}
        text={text}
        os={os}
        parse={parse}
        theme={theme}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elKeys}</div>;
};
