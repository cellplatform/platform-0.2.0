export type DenoProjectCreateArgs = {
  name?: string | null;
  description?: string | null;
};

export type DenoProject = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
