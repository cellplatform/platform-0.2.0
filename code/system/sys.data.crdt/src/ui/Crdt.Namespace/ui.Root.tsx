import { DEFAULTS, LabelItem, css, type t } from './common';
import { Item } from './ui.Item';

export const View: React.FC<t.CrdtNsProps> = (props) => {
  const { data = DEFAULTS.data, enabled = DEFAULTS.enabled, indent = DEFAULTS.indent } = props;
  const ns = data?.ns;
  if (!data || !ns) return '⚠️ not set: { data }';
  if (data.ns?.disposed) return '⚠️ disposed: { data: { ns } }';

  const container = ns.container;
  const isEmpty = Object.keys(container).length === 0;

  console.log('-------------------------------------------');
  console.log('props', props);
  console.log('ns', ns);
  console.log('container', container, isEmpty);

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

  const elList = Object.keys(container).map((key) => {
    const ns = container[key];

    console.log('ns', ns);

    return <Item key={key} enabled={enabled} />;
  });

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elList}
    </div>
  );
};
