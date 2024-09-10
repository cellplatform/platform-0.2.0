import { Color, DEFAULTS, LabelItem, RenderCount, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { useSelection } from './use.Selection';

type Props = t.ConnectorProps & { list: t.LabelListState; peer: t.PeerModel };

export const List: React.FC<Props> = (props) => {
  const { list, peer, onSelectionChange, debug = {}, tabIndex = DEFAULTS.props.tabIndex } = props;
  const behaviors = Wrangle.listBehaviors(props);

  useSelection({ peer, list, onSelectionChange });
  const List = LabelItem.Stateful.useListController({ list, behaviors });

  /**
   * [Render]
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
    }),
  };

  const elements = LabelItem.Model.List.map(list, (item, index) => {
    return (
      <LabelItem.Stateful
        {...List.item.handlers}
        key={item.instance}
        index={index}
        list={list}
        item={item}
        behaviors={List.item.behaviors}
      />
    );
  });

  return (
    <List.Provider>
      <div ref={List.ref} {...css(styles.base, props.style)} tabIndex={tabIndex}>
        {debug.renderCount && <RenderCount {...debug.renderCount} theme={theme.name} />}
        <div>{elements}</div>
      </div>
    </List.Provider>
  );
};
