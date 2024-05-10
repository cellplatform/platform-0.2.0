import { LabelItem } from '../../ui.LabelItem';
import { RenderCount, css, type t } from '../common';

export type SampleListProps = {
  behaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  debug?: { isList?: boolean; renderCount?: boolean; ruby?: boolean };
  style?: t.CssValue;
};

export const SampleList: React.FC<SampleListProps> = (props) => {
  const { behaviors, list, renderers, debug = {} } = props;
  const List = LabelItem.Stateful.useListController({ list, behaviors });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, index) => {
    return (
      <LabelItem.Stateful
        {...List.item.handlers}
        key={item.instance}
        index={index}
        list={debug.isList ? list : undefined}
        item={item}
        behaviors={List.item.behaviors}
        renderers={renderers}
        debug={debug.ruby}
        renderCount={debug.renderCount ? itemRenderCount : undefined}
      />
    );
  });

  return (
    <List.Provider>
      <div ref={List.ref} {...css(styles.base, props.style)} tabIndex={0}>
        {debug.renderCount && <RenderCount {...listRenderCount} />}
        <div>{elements}</div>
      </div>
    </List.Provider>
  );
};

/**
 * Helpers
 */
const itemRenderCount: t.RenderCountProps = { absolute: [0, -55, null, null], opacity: 0.2 };
const listRenderCount: t.RenderCountProps = { absolute: [-18, 0, null, null], opacity: 0.2 };
