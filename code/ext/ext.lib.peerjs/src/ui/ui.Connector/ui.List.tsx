import { DEFAULTS, LabelItem, RenderCount, css, type t } from './common';
import { useSelection } from './use.Selection';

type Props = t.ConnectorProps & { list: t.LabelListState };

export const List: React.FC<Props> = (props) => {
  const { list, peer, onSelectionChange, debug = {} } = props;
  const useBehaviors = Wrangle.useBehaviors(props);

  useSelection({ peer, list, onSelectionChange });
  const { ref, Provider, handlers } = LabelItem.Stateful.useListController({ list, useBehaviors });

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
        list={list}
        item={item}
        useBehaviors={useBehaviors}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)}>
        {debug.renderCount && <RenderCount {...debug.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  useBehaviors(props: Props) {
    const { behavior: b = {} } = props;
    const res: t.LabelItemBehaviorKind[] = ['Item', 'List'];

    const d = DEFAULTS.behavior;
    if (b.focusOnLoad ?? d.focusOnLoad) res.push('Focus.OnLoad');
    if (b.focusOnArrowKey ?? d.focusOnArrowKey) res.push('Focus.OnArrowKey');

    return res;
  },
} as const;
