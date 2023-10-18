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
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, index) => {
    return (
      <LabelItem.Stateful
        {...handlers}
        key={item.instance}
        index={index}
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
