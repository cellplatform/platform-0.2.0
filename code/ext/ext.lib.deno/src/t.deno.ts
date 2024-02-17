export type DenoProjectCreateArgs = {
  name?: string;
  description?: string;
};

export type DenoProject = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type DenoProjectListParams = {
  page?: number;
  limit?: number;
  q?: string;
  sort?: 'update_at' | 'name';
  order?: 'asc' | 'desc';
};
