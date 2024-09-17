import { TestServer as Server } from './Test.Http.Server.ts';

export const TestHttp = {
  server: Server.create,
} as const;
