import { t } from './common.mjs';
declare type FilesystemId = string;
export declare type SysFsChange = SysFsChangeWrite | SysFsChangeCopy | SysFsChangeMove | SysFsChangeDelete;
export declare type SysFsChangeWrite = {
    op: 'write';
    files: t.SysFsFileWriteResponse[];
};
export declare type SysFsChangeCopy = {
    op: 'copy';
    files: t.SysFsFileCopyResponse[];
};
export declare type SysFsChangeMove = {
    op: 'move';
    files: t.SysFsFileMoveResponse[];
};
export declare type SysFsChangeDelete = {
    op: 'delete';
    files: t.SysFsFileDeleteResponse[];
};
/**
 * EVENTS
 */
/**
 * Filesystem change event.
 */
export declare type SysFsChangedEvent = {
    type: 'sys.fs/changed';
    payload: SysFsChanged;
};
export declare type SysFsChanged = {
    id: FilesystemId;
    change: SysFsChange;
};
export {};
