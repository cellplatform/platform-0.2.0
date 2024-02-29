import { Monaco } from 'ext.lib.monaco.crdt';
import { css, type t, Doc } from './common';

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
        const onCmdEnter = () => props.onCmdEnterKey?.({ text: editor.getValue() });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onCmdEnter);

        console.log('env', env);
        if (env) {
          type TDoc = { code: string };
          const { store, docuri } = env;
          const doc = await store.doc.getOrCreate<TDoc>((d) => null, docuri);
          const lens = Doc.lens<TDoc, TDoc>(doc, [], (d) => null);
          Monaco.Crdt.Syncer.listen<TDoc>(monaco, editor, lens, ['code']);
        }
      }}
      onChange={(e) => props.onChange?.({ text: e.text })}
    />
  );

  return <div {...css(styles.base, props.style)}>{elEditor}</div>;
};
