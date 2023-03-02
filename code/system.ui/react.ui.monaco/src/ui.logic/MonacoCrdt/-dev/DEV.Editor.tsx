import { Color, css, MonacoEditor, t } from './common';
import { DevEditorCard } from './DEV.Editor.Card';

export type DevEditorProps = {
  name: string;
  doc: t.CrdtDocRef<t.SampleDoc>;
  language: t.EditorLanguage;
  style?: t.CssValue;
  onReady?: t.MonacoEditorReadyHandler;
};

export const DevEditor: React.FC<DevEditorProps> = (props) => {
  const { name, doc } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      backgroundColor: Color.format(0.5),
      backdropFilter: 'blur(10px)',
    }),
    left: css({
      backgroundColor: Color.format(1),
      borderRight: `solid 1px ${Color.format(-0.1)}`,
      display: 'grid',
    }),
    right: css({
      boxSizing: 'border-box',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <MonacoEditor onReady={props.onReady} language={props.language} />
      </div>
      <div {...styles.right}>
        <DevEditorCard name={name} doc={doc} />
      </div>
    </div>
  );
};
