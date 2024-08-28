import { useDoc, useDocs } from '.';
import { Color, ObjectView, Spinner, css, type t } from './common';

/**
 * Sample: useDocs (plural)
 */
export type SampleUseDocsProps = {
  store?: t.Store;
  uris?: t.UriString[];
  options?: t.UseDocsOptions;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const SampleUseDocs: React.FC<SampleUseDocsProps> = (props) => {
  const { store, uris = [], options } = props;
  const refs = uris.map((uri) => ({ uri, store }));
  const docs = useDocs(refs, options);

  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      padding: 8,
    }),
  };

  const elSpinner = docs.is.fetching && <SampleSpinner theme={theme.name} />;
  const data = {
    ...docs,
    refs: docs.refs.map((doc) => doc.uri),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {elSpinner}
      <ObjectView
        name={'useDocs'}
        data={data}
        theme={theme.name}
        fontSize={11}
        expand={{ paths: ['$', '$.is', '$.uris'] }}
      />
    </div>
  );
};

/**
 * Sample: useDoc (single)
 */
export type SampleUseDocProps = {
  store?: t.Store;
  uri?: t.UriString;
  options?: t.UseDocsOptions;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const SampleUseDoc: React.FC<SampleUseDocProps> = (props) => {
  const { store, uri, options } = props;
  const doc = useDoc(store, uri, options);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      padding: 8,
    }),
  };

  const elSpinner = doc.is.fetching && <SampleSpinner theme={theme.name} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elSpinner}
      <ObjectView
        name={'useDoc'}
        data={doc}
        theme={theme.name}
        fontSize={11}
        expand={{ paths: ['$', '$.is'] }}
      />
    </div>
  );
};

/**
 * Sample: <Spinner>
 */
export type SampleSpinnerProps = { theme?: t.CommonTheme; style?: t.CssValue };
export const SampleSpinner: React.FC<SampleSpinnerProps> = (props) => {
  const styles = {
    base: css({
      Absolute: [-20, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Spinner.Bar width={80} theme={props.theme} />
    </div>
  );
};
