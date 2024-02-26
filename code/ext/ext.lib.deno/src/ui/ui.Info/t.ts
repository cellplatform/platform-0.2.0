import type { t } from './common';

type Id = string;
type Index = number;

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Projects.List';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  projects?: {
    list?: t.DenoProject[];
    selected?: Id;
    onSelect?(e: { index: Index; project: t.DenoProject }): void;
    onDeploymentClick?(e: {
      index: Index;
      project: t.DenoProject;
      deployment: t.DenoDeployment;
    }): void;
  };
  deployments?: {
    list?: t.DenoDeployment[];
  };
};
