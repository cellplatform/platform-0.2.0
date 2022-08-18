import { t } from '../common';
/**
 * Read the "_instance" hidden ID from the bus.
 */
export declare function instance(bus: t.EventBus<any>): any;
/**
 * Convert a bus of one type into another type.
 */
export declare function busAsType<E extends t.Event>(bus: t.EventBus<any>): t.EventBus<E>;
/**
 * Determine if the given object in an EventBus.
 */
export declare function isBus(input: any): boolean;
