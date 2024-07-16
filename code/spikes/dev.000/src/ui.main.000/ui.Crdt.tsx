import { Color, css, DocUri, Monaco, type t } from './common';

export type CrdtProps = {
  docuri?: string;
  main: t.Shell;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Crdt: React.FC<CrdtProps> = (props) => {
  const { docuri } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const dividerBorder = `solid 1px ${Color.alpha(theme.fg, 0.8)}`;
  const styles = {
    base: css({
      color: theme.fg,
      borderTop: dividerBorder,
      display: 'grid',
      gridTemplateRows: `1fr auto`,
      rowGap: '5px',
    }),
    codeEditor: css({ display: 'grid' }),
    docuri: css({ padding: 50, borderTop: dividerBorder }),
  };

  const elEditor = (
    <div {...styles.codeEditor}>
      <Monaco.Editor
        theme={theme.name}
        language={'yaml'}
        // placeholder={displayUri}
        readOnly={true}
        // onDispose={(e) => controllerRef.current?.dispose()}
        onReady={(e) => {
          // const { monaco, editor } = e;
          // controllerRef.current = editorController({ monaco, editor, main });
        }}
      />
    </div>
  );

  const elDocUri = (
    <div {...styles.docuri}>
      <DocUri uri={docuri} theme={theme.name} fontSize={60} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEditor}
      {elDocUri}
    </div>
  );
};
