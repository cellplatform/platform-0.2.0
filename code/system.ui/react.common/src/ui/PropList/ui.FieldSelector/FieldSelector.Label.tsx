import { Fragment } from 'react';

import { t, css, Color, COLORS } from './common';
import { Util } from './Util.mjs';

export type FieldSelectorLabelProps = {
  all: string[];
  selected: string[];
  field: string;
  showIndexes: boolean;
  style?: t.CssValue;
  onClick?: () => void;
};

export const FieldSelectorLabel: React.FC<FieldSelectorLabelProps> = (props) => {
  const { field, all, selected, showIndexes } = props;
  const isSubField = Util.isSubField(all, field);
  const index = selected.indexOf(field);

  /**
   * [Render]
   */
  const styles = {
    subpart: css({ opacity: 0.4 }),
    index: css({
      marginLeft: 6,
      fontFamily: 'monospace',
      fontWeight: 600,
      fontSize: 10,
      color: Color.alpha(COLORS.DARK, 0.8),
      borderRadius: 3,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      boxSizing: 'border-box',
      PaddingX: 2,
    }),
  };

  const parts = field.split('.');
  const elParts = parts.map((part, i) => {
    const isLast = i === parts.length - 1;
    const style = !isLast && isSubField ? styles.subpart : undefined;
    return (
      <Fragment key={i}>
        <span {...style}>{part}</span>
        {!isLast && <span>{'.'}</span>}
      </Fragment>
    );
  });

  const elIndex = showIndexes && index > -1 && <span {...styles.index}>{index}</span>;

  return (
    <div {...css(props.style)} onMouseDown={props.onClick}>
      {elParts}
      {elIndex}
    </div>
  );
};
