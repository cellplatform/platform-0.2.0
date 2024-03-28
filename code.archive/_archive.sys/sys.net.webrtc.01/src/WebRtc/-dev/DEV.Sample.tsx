import { useEffect, useRef, useState } from 'react';
import { MonacoEditor } from 'sys.ui.react.monaco';
import { DevCrdtTextSample } from './DEV.CrdtText.mjs';

import { Color, COLORS, css, Dev, IFrame, type t } from './common';
import { DevCrdtSync } from './DEV.CrdtSync';

import type { Doc } from './DEV.CrdtSync';

import type { MonacoCodeEditor } from 'sys.ui.react.monaco/src/types';

export type DevSampleProps = {
  self: t.Peer;
  testrunner: { spinning?: boolean; results?: t.TestSuiteRunResponse | null };
  docFile: t.CrdtDocFile<Doc>;
};

export const DevSample: React.FC<DevSampleProps> = (props) => {
  const { testrunner, docFile, self } = props;
  const imageUrl = docFile.doc.current.url ?? '';
  const iframeUrl = docFile.doc.current.iframe ?? '';

  const codeEditorRef = useRef<MonacoCodeEditor>();
  const code = docFile.doc.current.code;

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const text = code ?? '';
    const editor = codeEditorRef.current;
    // if (editor && editor.getValue() === text) {
    //   editor.setValue(text);
    // }
  }, [code]);

  /**
   * [Render]
   */
  const elTestResults = (
    <Dev.TestRunner.Results
      spinning={testrunner.spinning}
      data={testrunner.results || undefined}
      scroll={true}
      style={{ Absolute: 0 }}
    />
  );

  const styles = {
    base: css({ display: 'grid', gridTemplateRows: '1fr 100px' }),
    main: css({ position: 'relative' }),
    footer: css({ borderTop: `solid 1px ${Color.format(-0.2)}`, display: 'grid' }),
    media: css({ Absolute: 0 }),
    overlayImage: css({
      Absolute: 0,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundColor: Color.format(0.3),
      backdropFilter: 'blur(30px)',
    }),
    overlayIFrame: css({
      Absolute: 0,
      backgroundColor: COLORS.WHITE,
    }),
  };

  return (
    <div {...styles.base}>
      <div {...styles.main}>
        {elTestResults}
        {/* {elMedia} */}
        {imageUrl && <div {...styles.overlayImage}></div>}
        {iframeUrl && (
          <IFrame
            src={iframeUrl}
            style={styles.overlayIFrame}
            onLoad={(e) => {
              console.log('on load', e);
              docFile.doc.change((d) => (d.iframe = e.href));
            }}
          />
        )}
      </div>
      <DevCrdtSync self={self} file={docFile} style={{ Absolute: 0, display: 'none' }} />
      <div {...styles.footer}>
        <MonacoEditor
          language={'markdown'}
          // text={docFile.doc.current.code?.toString() ?? ''}
          onChange={(e) => {
            // docFile.doc.change((d) => (d.code = e.text));
          }}
          onReady={(e) => {
            const { editor } = e;
            codeEditorRef.current = editor;
            const doc = docFile.doc;

            DevCrdtTextSample.init({ editor, doc });
          }}
        />
      </div>
    </div>
  );
};
