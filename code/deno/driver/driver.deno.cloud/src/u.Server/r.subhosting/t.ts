export type SubhostingResponse = {
  description: string;
  module: { name: string; version: string };
  auth: { user: string; verified: boolean };
};
