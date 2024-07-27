import { Color, css, Monaco, useDoc, type t } from './common';

export type CrdtViewProps = {
  docuri?: string;
  main: t.Shell;
  border?: number | [number, number, number, number];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const CrdtView: React.FC<CrdtViewProps> = (props) => {
  const { docuri, main } = props;

  const docRef = useDoc(main.repo.tmp.store, docuri);
  const doc = docRef.ref;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: Color.alpha(theme.bg, 0.95),
      backdropFilter: `blur(15px)`,
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Monaco.Crdt.CmdView
        doc={doc}
        repo={main.repo.tmp}
        theme={theme.name}
        historyStack={true}
        border={props.border ?? 1}
        style={{ height: 250 }}
      />
    </div>
  );
};
