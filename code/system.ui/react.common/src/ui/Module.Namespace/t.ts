import type { t } from './common';

/**
 * <Component>
 */
export type ModuleNamespaceProps<N extends string = string> = {
  name?: N;
  imports?: t.ModuleImports;
  render?: t.ModuleRenderer<any>;
  commandbar?: t.ModuleNamespaceCommandbarProps;
  flipped?: boolean;
  style?: t.CssValue;
};

export type ModuleNamespaceCommandbarProps = {
  visible?: boolean;
};
