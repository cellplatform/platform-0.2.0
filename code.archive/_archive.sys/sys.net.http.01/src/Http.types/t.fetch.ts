import type { Json, t } from './common';

export type HttpFetch = (req: t.HttpRequestPayload) => Promise<t.HttpFetchResponse>;

export type HttpFetchResponse = {
  status: number;
  statusText?: string;
  headers: Headers;
  body: ReadableStream<Uint8Array> | null;
  text(): Promise<string>;
  json(): Promise<Json>;
};
