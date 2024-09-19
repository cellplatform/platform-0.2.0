import type { DenoSubhostingAPI as D, t } from '../common/mod.ts';

export type SubhostingInfo = {
  description: string;
  module: { name: string; version: string };
  auth: { identity: string; verified: boolean };
  organization: t.SubhostingOrganization;
};

export type SubhostingOrganization = D.Organizations.Organization;
