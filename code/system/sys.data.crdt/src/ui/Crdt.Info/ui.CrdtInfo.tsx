import { css, DEFAULTS, FC, FIELDS, Pkg, PropList, Style, t, Time, Value } from './common';
import { HistoryItem } from './field.History.Item.mjs';
import { History } from './field.History.mjs';
import { File } from './field.File.mjs';

export type CrdtInfoProps = {
  fields?: t.CrdtInfoFields[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  data?: t.CrdtInfoData;
  padding?: t.CssEdgesInput;
  margin?: t.CssEdgesInput;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<CrdtInfoProps> = (props) => {
  const { width, minWidth = 230, maxWidth, fields = DEFAULTS.fields, data = {} } = props;

  const items = PropList.builder<t.CrdtInfoFields>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Driver', { label: 'Driver', value: Wrangle.automerge() })
    .field('History.Total', () => History(data))
    .field('History.Item', () => HistoryItem(data))
    .field('File', () => File(data))
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
      ...Style.toPadding(props.padding),
      ...Style.toMargins(props.margin),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PropList items={items} defaults={{ clipboard: false }} />
    </div>
  );
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
