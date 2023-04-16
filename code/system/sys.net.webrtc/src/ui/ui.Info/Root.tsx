import { useEffect, useRef, useState } from 'react';
import { FC, Color, COLORS, css, t, rx, DEFAULTS, PropList, Pkg, FIELDS } from './common';

import { FieldModuleVerify } from './field.Module.Verify';

export type WebRtcInfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.WebRtcInfoFields[];
  data?: t.WebRtcInfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<WebRtcInfoProps> = (props) => {
  const { fields = DEFAULTS.fields, data = {} } = props;

  const items = PropList.builder<t.WebRtcInfoFields>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify(data))
    .items(fields);

  return (
    <PropList
      style={props.style}
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: WebRtcInfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FIELDS: typeof FIELDS;
};
export const WebRtcInfo = FC.decorate<WebRtcInfoProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'WebRtcInfo' },
);
