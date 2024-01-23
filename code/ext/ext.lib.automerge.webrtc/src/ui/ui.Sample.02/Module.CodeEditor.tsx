import { useEffect } from 'react';
import { MonacoEditor } from 'sys.ui.react.monaco';
import { Statusbar } from './ui.Statusbar';
import { Color, css, type t } from './common';

import { Text } from '@automerge/automerge';

export type TDoc = { text: Text };

export type CodeEditorLoaderProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const CodeEditorLoader: React.FC<CodeEditorLoaderProps> = (props) => {
  const { store, docuri } = props;

  useEffect(() => {
    props.store.doc.get<TDoc>(docuri).then((doc) => {
      console.log('doc', doc);
    });
  }, [docuri]);

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
    <MonacoEditor
      style={css(styles.base, props.style)}
      focusOnLoad={true}
      onReady={(e) => {
        e.editor.setValue('👋\nHello World\n');
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
