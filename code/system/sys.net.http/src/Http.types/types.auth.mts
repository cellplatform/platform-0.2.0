import { t } from './common.mjs';

export type HttpAuthorize = (args: t.HttpRequestPayload) => Promise<HttpAuthorizeResponse>;
export type HttpAuthorizeResponse = boolean | number | { status: number; message?: string };
