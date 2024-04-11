export * from './t.client';
export * from './t.events';
export * from './t.fetch';
export * from './t.payload';
export * from './t.auth';

export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type HttpHeaders = { [key: string]: string };
