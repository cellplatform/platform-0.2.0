import { LabelItem } from '../../LabelItem';
import { RenderCount } from '../../RenderCount';
import { css, type t } from '../common';

export type SampleListProps = {
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  debug?: { isList?: boolean; renderCount?: boolean };
  style?: t.CssValue;
};

export const SampleList: React.FC<SampleListProps> = (props) => {
  const { useBehaviors, list, renderers, debug = {} } = props;
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list, useBehaviors });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', outline: 'none' }),
  };

  const length = list?.current.length ?? 0;
  const elements = Array.from({ length }).map((_, i) => {
    const [item] = LabelItem.Model.List.getItem(list, i);
    if (!item) return null;
    return (
      <LabelItem.Stateful
        {...handlers}
        key={item.instance}
        index={i}
        total={length}
        list={debug.isList ? list : undefined}
        item={item}
        renderers={renderers}
        useBehaviors={useBehaviors}
        renderCount={debug.renderCount ? itemRenderCount : undefined}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)}>
        {debug.renderCount && <RenderCount {...listRenderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};

/**
 * Helpers
 */
const itemRenderCount: t.RenderCountProps = { absolute: [0, -55, null, null], opacity: 0.2 };
const listRenderCount: t.RenderCountProps = { absolute: [-18, 0, null, null], opacity: 0.2 };
