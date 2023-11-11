import { useRef } from 'react';
import { Renderers } from './Renderers';
import { DEFAULTS, LabelItem, RenderCount, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

export const View: React.FC<t.RepoListProps> = (props) => {
  const { list, tabIndex = DEFAULTS.tabIndex } = props;

  const renderers = useRef(Renderers.init()).current;
  const useBehaviors = Wrangle.behaviors(props);
  const { Provider, ref, handlers } = LabelItem.Stateful.useListController({ list, useBehaviors });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const elements = LabelItem.Model.List.map(list, (item, i) => {
    return (
      <LabelItem.Stateful
        {...handlers}
        key={item.instance}
        index={i}
        list={list}
        item={item}
        renderers={renderers}
        useBehaviors={useBehaviors}
      />
    );
  });

  return (
    <Provider>
      <div ref={ref} {...css(styles.base, props.style)} tabIndex={tabIndex}>
        {props.renderCount && <RenderCount {...props.renderCount} />}
        <div>{elements}</div>
      </div>
    </Provider>
  );
};
