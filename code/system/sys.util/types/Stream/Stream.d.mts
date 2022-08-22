import { t } from './common.mjs';
/**
 * Work with a readable stream.
 *
 *    - https://developer.mozilla.org/en-US/docs/Web/API/ReadStream
 *    - https://developer.mozilla.org/en-US/docs/Web/API/Streams_API#concepts_and_usage
 *    - https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 *
 */
export declare const Stream: {
    /**
     * Determine if the given input is a readable stream.
     */
    isReadableStream(input: any): boolean;
    /**
     * Encode an input string to a UTF-8 encoded [Uint8Array].
     */
    encode(input?: string): Uint8Array;
    /**
     * Decode a [Uint8Array] to a UTF-8 string.
     */
    decode(input?: BufferSource, options?: TextDecodeOptions): string;
    /**
     * WEB: Read the given stream into an [Uint8Array].
     */
    toUint8Array(input: ReadableStream | t.Json | Uint8Array): Promise<Uint8Array>;
};
