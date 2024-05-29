import { css, useRenderer, type t } from '../common';
import { Wrangle } from './u';

export type PanelBarProps = {
  instance: t.DevInstance;
  edge: 'Header' | 'Footer';
  current?: t.DevRenderPropsEdge;
  style?: t.CssValue;
};

export const PanelEdge: React.FC<PanelBarProps> = (props) => {
  const { instance, current, edge } = props;
  const renderer = current?.renderer;
  const { element } = useRenderer(instance, renderer);

  if (!renderer || !element) return <div />;

  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      Padding: current?.padding,
      borderTop: edge === 'Footer' ? Wrangle.borderStyle(current) : undefined,
      borderBottom: edge === 'Header' ? Wrangle.borderStyle(current) : undefined,
      overflowX: 'hidden',
    }),
    body: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)} data-component={`dev.harness:${edge}`}>
      <div {...styles.body}>{element}</div>
    </div>
  );
};

/**
 * Header
 */
export type PanelHeaderProps = Omit<PanelBarProps, 'edge'>;
export const PanelHeader: React.FC<PanelHeaderProps> = (props) => {
  return <PanelEdge {...props} edge={'Header'} />;
};

/**
 * Footer
 */
export type PanelFooterProps = Omit<PanelBarProps, 'edge'>;
export const PanelFooter: React.FC<PanelFooterProps> = (props) => {
  return <PanelEdge {...props} edge={'Footer'} />;
};
