import { Monaco } from 'ext.lib.monaco.crdt';
import { Color, Doc, css, type t } from './common';
import { Statusbar } from './ui.Statusbar';

export type TDoc = { text: string };

export type CodeEditorLoaderProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const CodeEditorLoader: React.FC<CodeEditorLoaderProps> = (props) => {
  const { store, docuri } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: Color.format(0.8),
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
  };

  const elEditor = (
    <Monaco.Editor
      style={css(styles.base, props.style)}
      focusOnLoad={true}
      onReady={async (e) => {
        const doc = await store.doc.getOrCreate<TDoc>((d) => null, docuri);
        const lens = Doc.lens<TDoc, TDoc>(doc, [], (d) => null);
        Monaco.Crdt.Syncer.listen<TDoc>(e.monaco, e.editor, lens, ['text']);

        lens.events().changed$.subscribe((e) => {
          console.log('lens changed:', e);
        });
      }}
    />
  );

  const statusText = `Lens<TCodeEditor> → sys.crdt:${props.docuri}`;
  const elStatusbar = <Statusbar left={'Cell'} right={statusText} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elEditor}
      {elStatusbar}
    </div>
  );
};
