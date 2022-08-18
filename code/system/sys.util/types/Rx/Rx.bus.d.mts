import * as t from 'sys.types';
import { Subject } from 'rxjs';
import { Pump } from './Rx.Pump.mjs';
declare type E = t.Event;
declare type BusFactory = <T extends E = E>(input?: Subject<any> | t.EventBus<any>) => t.EventBus<T>;
declare type Bus = BusFactory & {
    isBus(input: any): boolean;
    asType<T extends E>(bus: t.EventBus<any>): t.EventBus<T>;
    instance(bus: t.EventBus<any>): string;
    pump: typeof Pump;
};
export declare const bus: Bus;
export {};
