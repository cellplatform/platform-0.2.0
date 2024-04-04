import type { client } from './Http.client';

export type DenoHttpClient = ReturnType<typeof client>;

export type DenoHttpOrigins = { local: string; remote: string };
export type DenoHttpOptions = {
  origins?: Partial<DenoHttpOrigins>;
  accessToken?: string;
  forcePublic?: boolean;
};
