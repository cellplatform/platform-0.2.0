import { Color, css, Monaco, rx, useDoc, Wrangle, Yaml, type t } from './common';

export type CrdtViewProps = {
  main: t.Shell;
  repo?: t.ShellRepo;
  docuri?: string;
  border?: number | [number, number, number, number];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const CrdtView: React.FC<CrdtViewProps> = (props) => {
  const { docuri, main } = props;
  const identity = `peer:${main.self.id}`;

  const repo = props.repo ?? main.repo.tmp;
  const docRef = useDoc(repo.store, docuri);
  const doc = docRef.ref;

  const enabled = !!doc?.uri;
  const dataPath = Wrangle.dataPath(doc?.uri);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: Color.alpha(theme.bg, 0.8),
      backdropFilter: `blur(3px)`,
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Monaco.Crdt.Editor
        style={{ height: 320 }}
        border={props.border ?? 1}
        data={{ doc, repo }}
        theme={theme.name}
        historyStack={true}
        enabled={enabled}
        editor={{ identity, dataPath }}
        identityLabel={{ position: [null, null, -22, 6] }}
        onDataReady={(e) => {
          const lens = e.lens;
          const changed$ = lens.events().changed$;
          const text$ = changed$.pipe(rx.distinctWhile((p, n) => p.after.text === n.after.text));
          text$.pipe(rx.debounceTime(500)).subscribe((e) => {
            /**
             * Parse the YAML
             */
            const yamlString = lens.current.text;

            /**
             * TODO 🐷
             */
            console.group('🌳 parsed/source-maps');
            console.log('lens.current', lens.current);

            // Parse the YAML string with source tokens
            const doc = Yaml.parseDocument(yamlString, { keepSourceTokens: true });

            // Convert to a JS object (you can still use { mapAsMap: true } if needed)
            const parsedObj = doc.toJS({ mapAsMap: true });
            const json = doc.toJSON();
            console.log('m', json);

            console.log('parsedObj', parsedObj);
            console.log("doc.get('foo')", doc.get('foo'));
            console.groupEnd();

            lens.change((d) => {
              const yaml = d as t.EditorContentYaml;
              yaml.parsed = doc.toJSON();
            });
          });
        }}
      />
    </div>
  );
};

/**
 * Helpers
 */
