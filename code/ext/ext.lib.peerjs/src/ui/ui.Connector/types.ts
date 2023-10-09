import type { t } from './common';

export type ConnectorActionKind = 'local:left' | 'local:copy' | 'remote:left';
export type ConnectorItem = t.LabelItem<t.ConnectorActionKind>;
export type ConnectorItemRenderers = t.LabelItemRenderers<t.ConnectorActionKind>;

/**
 * <Component>
 */
export type ConnectorProps = {
  style?: t.CssValue;
};
