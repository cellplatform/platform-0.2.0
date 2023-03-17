import { useEffect, useRef, useState } from 'react';
import { Pkg, Color, COLORS, css, t, rx, FC, PropList, DEFAULTS, FIELDS } from './common';

export type CrdtInfoProps = {
  fields?: t.CrdtInfoFields[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  padding?: t.CssEdgesInput;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<CrdtInfoProps> = (props) => {
  const { width, minWidth = 230, maxWidth, fields = DEFAULTS.fields } = props;

  const items = PropList.builder<t.CrdtInfoFields>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    // .field('Module.Name', { label: 'Name', value: Pkg.name })
    // .field('Module.Version', { label: 'Version', value: Pkg.version })
    .items(fields);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      position: 'relative',
      width,
      minWidth,
      maxWidth,
      Padding: props.padding,
      boxSizing: 'border-box',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PropList items={items} defaults={{ clipboard: false }} />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FIELDS: typeof FIELDS;
};
export const CrdtInfo = FC.decorate<CrdtInfoProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'CrdtInfo' },
);
