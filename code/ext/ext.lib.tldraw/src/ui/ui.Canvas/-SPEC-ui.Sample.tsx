import { useAutomergeStore } from 'automerge-tldraw';
import { Canvas } from '.';
import { Doc, type t } from '../../test.ui';

export type CanvasSampleProps = t.CanvasProps & {
  userId: string;
  doc: t.DocRef<t.TLStoreSnapshot>;
};

export const CanvasSample: React.FC<CanvasSampleProps> = (props) => {
  const { doc, userId } = props;
  const handle = Doc.toHandle(doc);
  const store = useAutomergeStore({ handle, userId });
  return <Canvas {...props} store={store} />;
};
