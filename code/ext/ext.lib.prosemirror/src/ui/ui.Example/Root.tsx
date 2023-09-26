import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import 'prosemirror-menu/style/menu.css';

/**
 * Docs:
 *    https://prosemirror.net/examples/basic/
 */
const View: React.FC<t.ExampleEditorProps> = (props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const elEditor = editorRef.current;
    const elContent = contentRef.current;
    const { dispose, dispose$ } = rx.disposable();

    console.log('el', elEditor);

    if (elEditor && elContent) {
      // Mix the nodes from prosemirror-schema-list into the basic schema to
      // create a schema with list support.
      const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
        marks: schema.spec.marks,
      });

      const editor = new EditorView(elEditor, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(mySchema).parse(elContent),
          plugins: exampleSetup({ schema: mySchema }),
        }),
      });

      dispose$.subscribe(() => editor.destroy());
    }

    return dispose;
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
    }),
    editor: css({
      // Absolute: [24, 0, 0, 0],
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div ref={editorRef} {...css(styles.base, props.style)}>
      <div ref={contentRef} {...styles.editor}></div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ExampleEditor = FC.decorate<t.ExampleEditorProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Example.Editor' },
);
