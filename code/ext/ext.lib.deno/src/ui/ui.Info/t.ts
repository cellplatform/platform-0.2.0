import type { t } from './common';

type Id = string;
type Index = number;

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  stateful?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onStateChange?(e: InfoData): void;
};

/**
 * Data
 */
export type InfoField = 'Module' | 'Module.Verify' | 'Auth.AccessToken' | 'Projects.List';

export type InfoData = {
  endpoint?: t.HttpOptions;
  projects?: InfoDataProjects;
  deployments?: InfoDataDeployments;
};

export type InfoDataProjects = {
  label?: string;
  list?: t.DenoProject[];
  error?: InfoError;
  selected?: Id;
  loading?: boolean;
  onSelect?(e: { index: Index; project: t.DenoProject }): void;
  onOpenDeployment?(e: {
    index: Index;
    project: t.DenoProject;
    deployment: t.DenoDeployment;
  }): void;
};

export type InfoDataDeployments = {
  list?: t.DenoDeployment[];
};

export type InfoError = { message: string; status?: number };
