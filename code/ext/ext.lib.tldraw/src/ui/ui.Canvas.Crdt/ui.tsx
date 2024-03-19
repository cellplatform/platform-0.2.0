import { useAutomergeStore } from 'automerge-tldraw';
import { Canvas } from '../ui.Canvas';
import { Doc, css, type t } from './common';

export type StatefulProps = Required<Pick<t.CanvasCrdtProps, 'userId' | 'doc'>>;

export const View: React.FC<t.CanvasCrdtProps> = (props) => {
  const { doc, userId } = props;
  const styles = {
    error: css({ display: 'grid', placeItems: 'center', padding: 8 }),
  };
  if (!(doc && userId)) return <div {...styles.error}>{'The doc and userId not provided.'}</div>;
  return <Stateful {...props} doc={doc} userId={userId} />;
};

const Stateful: React.FC<StatefulProps> = (props) => {
  const { doc, userId } = props;
  const handle = Doc.toHandle(doc);
  const store = useAutomergeStore({ handle, userId });
  return <Canvas {...props} store={store} />;
};
