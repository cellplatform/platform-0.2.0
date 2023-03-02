import { Color, css, MonacoEditor, t } from './common';
import { DevEditorState } from './DEV.Editor.State';

export type DevEditorProps = {
  name: string;
  doc: t.CrdtDocRef<t.SampleDoc>;
  style?: t.CssValue;
  onReady?: t.MonacoEditorReadyHandler;
};

export const DevEditor: React.FC<DevEditorProps> = (props) => {
  const { name, doc } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateColumns: '1fr 1fr' }),
    left: css({ borderRight: `solid 1px ${Color.format(-0.1)}`, display: 'grid' }),
    right: css({ padding: 5, display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <MonacoEditor onReady={props.onReady} />
      </div>
      <div {...styles.right}>
        <DevEditorState name={name} doc={doc} />
      </div>
    </div>
  );
};
