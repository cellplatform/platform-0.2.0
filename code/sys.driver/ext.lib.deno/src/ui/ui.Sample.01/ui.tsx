import { Monaco } from 'ext.lib.monaco.crdt';
import { Crdt, css, type t } from './common';

export const Sample: React.FC<t.SampleProps> = (props) => {
  const { env } = props;

  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
  };

  const elEditor = (
    <Monaco.Editor
      style={css(styles.base, props.style)}
      focusOnLoad={true}
      text={props.code}
      language={'typescript'}
      onReady={async (e) => {
        const { editor, monaco } = e;
        const onCmdEnter = () => {
          const text = editor.getValue();
          const selections = editor.getSelections() || [];
          props.onCmdEnterKey?.({ text, selections });
        };
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onCmdEnter);

        if (env) {
          type TDoc = { code: string };
          const { store, docuri } = env;
          const doc = await store.doc.getOrCreate<TDoc>((d) => null, docuri);
          const lens = Crdt.Doc.lens<TDoc, TDoc>(doc, [], (d) => null);
          Monaco.Crdt.Syncer.listen(monaco, editor, lens, ['code']);
        }
      }}
      onChange={(e) => props.onChange?.(e.state)}
    />
  );

  return <div {...css(styles.base, props.style)}>{elEditor}</div>;
};
