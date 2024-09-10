import { Monaco } from 'ext.lib.monaco.crdt';
import { Doc, css, type t } from './common';

export const Sample: React.FC<t.SampleProps> = (props) => {
  const { env } = props;

  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
  };

  const elEditor = (
    <Monaco.Editor
      style={css(styles.base, props.style)}
      focusOnLoad={true}
      text={props.text}
      language={'markdown'}
      onReady={async (e) => {
        const { editor, monaco } = e;
        const onCmdEnter = () => {
          const selections = editor.getSelections() || [];
          const content = Monaco.Wrangle.Editor.content(editor);
          props.onCmdEnterKey?.({ content, selections });
        };
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onCmdEnter);

        if (env) {
          type TDoc = { text: string };
          const { store, docuri } = env;
          const doc = await store.doc.getOrCreate<TDoc>((d) => null, docuri);
          const lens = Doc.lens<TDoc, TDoc>(doc, [], (d) => null);
          Monaco.Crdt.Syncer.listen(monaco, editor, lens);
        }
      }}
      onChange={(e) => {
        const { content, selections } = e;
        props.onChange?.({ content, selections });
      }}
    />
  );

  return <div {...css(styles.base, props.style)}>{elEditor}</div>;
};
