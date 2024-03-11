import { TopologicalSort as Topological } from './Sort.Topological';
import { StringSort as String } from './Sort.String';

/**
 * Sorting helpers.
 */
export const Sort = { Topological, String } as const;
