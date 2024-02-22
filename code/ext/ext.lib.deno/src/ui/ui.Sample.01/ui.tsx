import { Monaco } from 'ext.lib.monaco.crdt';
import { css, type t } from './common';

export const Sample: React.FC<t.SampleProps> = (props) => {
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

        /**
         * TODO 🐷
         */

        //         const doc = await store.doc.getOrCreate<TDoc>((d) => null, docuri);
        //         const lens = Doc.lens<TDoc, TDoc>(doc, [], (d) => null);
        //         Monaco.Crdt.Syncer.listen<TDoc>(e.monaco, e.editor, lens, ['text']);
        //
        //         lens.events().changed$.subscribe((e) => {
        //           console.log('lens changed:', e);
        //         });
      }}
      onChange={(e) => props.onChange?.({ text: e.text })}
    />
  );

  return <div {...css(styles.base, props.style)}>{elEditor}</div>;
};
