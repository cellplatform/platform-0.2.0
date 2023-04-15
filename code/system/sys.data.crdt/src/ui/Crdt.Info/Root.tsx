import { useEffect, useState } from 'react';

import { Card, css, DEFAULTS, FC, FIELDS, Pkg, PropList, rx, Style, t } from './common';
import { FieldFile } from './field.File';
import { FieldHistoryItem } from './field.History.Item';
import { FieldHistory } from './field.History.mjs';
import { FieldNetwork } from './field.Network';
import { FieldModuleVerify } from './field.Module.Verify';
import { FieldUrl, FieldUrlQRCode } from './field.Url';
import { useFile } from './useFile.mjs';

export type CrdtInfoProps = {
  title?: t.PropListTitleInput;
  fields?: t.CrdtInfoFields[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  data?: t.CrdtInfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<CrdtInfoProps> = (props) => {
  const { width, minWidth = 230, maxWidth, fields = DEFAULTS.fields, data = {} } = props;
  const file = useFile(data);

  const items = PropList.builder<t.CrdtInfoFields>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify(data))
    .field('Driver.Library', { label: 'Library', value: Wrangle.automerge() })
    .field('Driver.Runtime', { label: 'Runtime', value: 'ƒ ← WASM ← Rust' })
    .field('History', () => FieldHistory(data))
    .field('History.Item', () => FieldHistoryItem(data))
    .field('File', () => FieldFile(data, file))
    .field('Network', () => FieldNetwork(data))
    .field('Url', () => FieldUrl(data))
    .field('Url.QRCode', () => FieldUrlQRCode(data))
    .items(fields);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      width,
      minWidth,
      maxWidth,
    }),
    edges: css({ ...Style.toMargins(props.margin) }),
  };

  const elBody = (
    <PropList title={Wrangle.title(props)} items={items} defaults={{ clipboard: false }} />
  );

  if (props.card) {
    return (
      <Card style={css(styles.base, props.style)} padding={[20, 25, 30, 25]} margin={props.margin}>
        {elBody}
      </Card>
    );
  }

  return <div {...css(styles.base, styles.edges, props.style)}>{elBody}</div>;
};

/**
 * Helpers
 */

const Wrangle = {
  automerge() {
    const name = '@automerge/automerge';
    const version = Pkg.dependencies[name] ?? '0.0.0';
    return `${name}@${version}`;
  },

  title(props: CrdtInfoProps) {
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
  Wrangle: typeof PropList.Wrangle;
};
export const CrdtInfo = FC.decorate<CrdtInfoProps, Fields>(
  View,
  { DEFAULTS, FIELDS, Wrangle: PropList.Wrangle },
  { displayName: 'CrdtInfo' },
);
