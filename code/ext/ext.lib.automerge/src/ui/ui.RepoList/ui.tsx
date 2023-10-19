import { css, type t } from './common';
import { List } from './ui.List';

export const View: React.FC<t.RepoListProps> = (props) => {
  const { list, renderers } = props;

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <List
      //
      list={list}
      renderers={renderers}
      renderCount={props.renderCount}
    />
  );
};
