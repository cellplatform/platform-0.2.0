import { DEFAULTS, css, type t } from './common';
import { Item } from './ui.Item';
import { useController } from './useController.mjs';

export const View: React.FC<t.CrdtNsProps> = (props) => {
  const {
    enabled = true,
    data = DEFAULTS.data,
    indent = DEFAULTS.indent,
    useBehaviors = DEFAULTS.useBehaviors,
  } = props;
  const ns = data?.ns;

  const controller = useController({
    ns,
    enabled: enabled && useBehaviors,
  });

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

  const elEmpty = isEmpty && <Item state={controller} />;

  const elList = list.map((data, i) => {
    const key = `${i}.${data.namespace}`;
    return <Item key={key} state={controller} />;
  });

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elList}
    </div>
  );
};
