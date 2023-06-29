import { DEFAULTS, FC, FIELDS, Pkg, PropList, type t } from './common';
import { FieldFile } from './fields/File';
import { FieldHistoryItem } from './fields/History.Item';
import { FieldHistory } from './fields/History.mjs';
import { FieldModuleVerify } from './fields/Module.Verify';
import { FieldNetwork } from './fields/Network';
import { FieldUrl, FieldUrlQRCode } from './fields/Url';
import { useFile } from './hooks/useFile.mjs';

export type CrdtInfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.CrdtInfoField[];
  data?: t.CrdtInfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<CrdtInfoProps> = (props) => {
  const { fields = DEFAULTS.fields, data = {} } = props;
  const file = useFile(data);

  const items = PropList.builder<t.CrdtInfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify(data))
    .field('Driver.Library', { label: 'Library', value: Wrangle.automergeLib() })
    .field('Driver.Runtime', { label: 'Runtime', value: 'ƒ ← WASM ← Rust' })
    .field('History', () => FieldHistory(data))
    .field('History.Item', () => FieldHistoryItem(fields, data))
    .field('File', () => FieldFile(fields, data, file))
    .field('Network', () => FieldNetwork(data))
    .field('Url', () => FieldUrl(data))
    .field('Url.QRCode', () => FieldUrlQRCode(data))
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  automergeLib() {
    const name = '@automerge/automerge';
    const version = Pkg.dependencies[name] ?? '0.0.0';
    return `automerge@${version}`;
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
