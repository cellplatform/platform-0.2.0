import { useEffect, useState } from 'react';
import { COLORS, Color, Spinner, css, type t } from './common';

export type LoaderDef = {
  module?: { name: string; docuri: string };
};

export type LoaderProps = {
  store: t.Store;
  lens: t.Lens<LoaderDef>;
  style?: t.CssValue;
};

export const Loader: React.FC<LoaderProps> = (props) => {
  const { lens, store } = props;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState<JSX.Element>();

  useEffect(() => {
    const events = lens.events();

    events.changed$.subscribe(async (e) => {
      const m = e.after.module;
      const name = m?.name;
      const docuri = m?.docuri;

      setVisible(name !== undefined);
      if (!name || !docuri) return;

      setLoading(true);
      setBody(undefined);

      if (name === 'CodeEditor') {
        const { CodeEditorLoader } = await import('./-SPEC.Loader.Code');
        setBody(<CodeEditorLoader store={store} docuri={docuri} />);
      }

      setLoading(false);
    });

    return events.dispose;
  }, []);

  if (!visible) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: 'auto',
      backgroundColor: Color.format(0.8),
      display: 'grid',
    }),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elSpinner = loading && (
    <div {...styles.spinner}>
      <Spinner.Bar color={COLORS.DARK} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {body}
      {elSpinner}
    </div>
  );
};
