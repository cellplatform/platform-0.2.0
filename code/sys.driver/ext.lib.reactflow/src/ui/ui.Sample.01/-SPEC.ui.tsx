import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

import { Color, css, type t } from './common';

export type SampleProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * https://reactflow.dev/learn
 * https://reactflow.dev/learn/getting-started/building-a-flow
 */
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export const Sample: React.FC<SampleProps> = (props) => {
  const {} = props;

  console.log('props', props);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ReactFlow
        //
        nodes={initialNodes}
        edges={initialEdges}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};
