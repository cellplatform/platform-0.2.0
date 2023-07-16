import { DEFAULTS, css, type t } from './common';
import { Item } from './ui.Item';

export const View: React.FC<t.CrdtNsProps> = (props) => {
  const { data = DEFAULTS.data, enabled = DEFAULTS.enabled, indent = DEFAULTS.indent } = props;
  const ns = data?.ns;
  if (!data || !ns) return '⚠️ not set: { data }';
  if (data.ns?.disposed) return '⚠️ disposed: { data: { ns } }';

  const list = ns.list();
  const isEmpty = list.length === 0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      paddingLeft: indent,
    }),
  };

  const elEmpty = isEmpty && <Item enabled={enabled} />;

  const elList = list.map((data, i) => {
    const key = `${i}.${data.namespace}`;
    return <Item key={key} data={data} enabled={enabled} />;
  });

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elList}
    </div>
  );
};
