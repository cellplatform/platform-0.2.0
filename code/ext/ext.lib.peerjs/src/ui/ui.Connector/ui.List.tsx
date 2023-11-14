import { DEFAULTS, LabelItem, RenderCount, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { useSelection } from './use.Selection';

type Props = t.ConnectorProps & { list: t.LabelListState };

export const List: React.FC<Props> = (props) => {
  const { list, peer, onSelectionChange, debug = {}, tabIndex = DEFAULTS.tabIndex } = props;
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
      <div ref={ref} {...css(styles.base, props.style)} tabIndex={tabIndex}>
        {debug.renderCount && <RenderCount {...debug.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
