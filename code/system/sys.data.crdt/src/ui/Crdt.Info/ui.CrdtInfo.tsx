import { css, DEFAULTS, FC, FIELDS, Pkg, PropList, Style, t, Time, Value } from './common';

export type CrdtInfoData = {
  history?: {
    item?: { data: t.AutomergeState<any>; title?: string };
  };
};

export type CrdtInfoProps = {
  fields?: t.CrdtInfoFields[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  data?: CrdtInfoData;
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
    .field('History.Item', () => {
      const item = data.history?.item;
      if (!item) return;
      const change = item.data.change;
      const hash = change.hash.slice(0, 8);
      const actor = change.actor.slice(0, 8);
      const title = item.title ?? 'History Item';

      const res: t.PropListItem[] = [];
      const indent = 15;

      res.push({
        label: title,
        value: `${change.ops.length} ${Value.plural(change.ops.length, 'operation', 'operations')}`,
      });
      res.push({ label: 'Actor', value: actor, tooltip: change.actor, indent });
      res.push({ label: 'Hash', value: hash, tooltip: change.hash, indent });

      if (change.message) res.push({ label: 'Message', value: change.message, indent });

      if (change.time) {
        const time = Time.day(change.time);
        const elapsed = Time.elapsed(time);
        const format = elapsed.sec < 60 ? 'D MMM YYYY, h:mm:ssa' : 'D MMM YYYY, h:mma';
        res.push({
          label: 'Time',
          value: time.format(format),
          indent,
        });
      }
      return res;
    })
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
