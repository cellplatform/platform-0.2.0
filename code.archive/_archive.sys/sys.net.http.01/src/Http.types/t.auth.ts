import type { t } from './common';

export type HttpAuthorize = (args: t.HttpRequestPayload) => Promise<HttpAuthorizeResponse>;
export type HttpAuthorizeResponse = boolean | number | { status: number; message?: string };
