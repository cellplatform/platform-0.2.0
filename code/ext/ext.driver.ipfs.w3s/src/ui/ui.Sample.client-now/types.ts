export type { Web3Storage } from 'web3.storage';

export type SampleFile = { cid: string; path: string; bytes: number; modified: number };

/**
 * Events
 */
export type SampleDropPutHandler = (e: SampleDropPutHandlerArgs) => void;
export type SampleDropPutHandlerArgs = { cid: string };
