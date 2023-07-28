export type DocSidebarType = DocSidebarYaml & {
  kind: 'doc.Sidebar';
};

export type DocSidebarYaml = {
  title?: DocSidebarTitle;
  markdown?: string;
  margin: { top?: number; bottom?: number };
};

export type DocSidebarTitle = {
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
};
