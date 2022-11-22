export type DocSidebarType = DocSidebarYaml & {
  kind: 'doc.Sidebar';
};

export type DocSidebarYaml = {
  title?: string;
  markdown?: string;
  margin: { top?: number; bottom?: number };
};
