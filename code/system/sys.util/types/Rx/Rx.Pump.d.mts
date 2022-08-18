import * as t from 'sys.types';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
/**
 * An [EventPump] implementation.
 * Note:
 *    Event pumps allow a way of collapsing a rxjs (Observable) setup into
 *    pure functions for passing between libraries, where the rxjs library
 *    may differ. This provides a JS native way of bridging observables.
 */
export declare const Pump: {
    /**
     * Create a pump using the given bus as the subject.
     */
    create<E extends t.Event<any> = t.Event<any>>(bus: t.EventBus<any>, options?: {
        dispose$?: Observable<any> | undefined;
        filter?: t.EventPumpFilter<E> | undefined;
    }): t.EventPump<E>;
    /**
     * Connect a pump to a bus, streaming the pumped events two-way (in/out)
     * through the connected bus.
     */
    connect<E_1 extends t.Event<any> = t.Event<any>>(pump: t.EventPump<E_1>, options?: {
        dispose$?: Observable<any> | undefined;
        filter?: t.EventPumpFilter<E_1> | undefined;
    }): {
        alive: boolean;
        dispose: () => void;
        dispose$: Observable<void>;
        /**
         * Connect the pump to the given event-bus.
         */
        to(bus: t.EventBus<any>): any;
        /**
         * Clone the connection providing a filter.
         */
        filter(fn: t.EventPumpFilter<E_1>): any;
    };
};
