export * from './types.client';
export * from './types.events';
export * from './types.fetch';
export * from './types.payload';
export * from './types.auth';

export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type HttpHeaders = { [key: string]: string };
