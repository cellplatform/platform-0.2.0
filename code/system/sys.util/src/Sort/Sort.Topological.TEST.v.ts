import { expect, describe, it } from '../test';
import { TopologicalSort } from './Sort.Topological';

describe('Topological Sort', () => {
  describe('hasLoop', () => {
    it('false: no loops', () => {
      const list = new Map();
      list.set('A', ['B', 'C']);
      list.set('B', ['D', 'C']);
      list.set('C', ['E']);

      expect(TopologicalSort.hasLoop(list)).to.eql(false);
    });

    it('true: (cyclic dependency)', () => {
      const list = new Map();
      list.set('A', ['B', 'C']);
      list.set('B', ['D', 'C']);
      list.set('C', ['E', 'A']); // <== Loop back to "A"
      list.set('D', ['E', 'F']);
      list.set('G', ['E', 'F']);

      expect(TopologicalSort.hasLoop(list)).to.eql(true);
    });
  });

  describe('sorting', () => {
    const list = new Map();
    list.set('A', ['B', 'C']);
    list.set('B', ['D', 'C']);
    list.set('C', ['E']);
    list.set('D', ['E', 'F']);
    list.set('G', ['E', 'F']);

    it('BFS (Breadth-First-Search)', () => {
      const bfs = TopologicalSort.bfs(list);
      expect(bfs).to.eql(['A', 'G', 'B', 'C', 'E', 'F', 'D']);
    });

    it('DFS (Depth-First-Search)', () => {
      const dfs = TopologicalSort.dfs(list);
      expect(dfs).to.eql(['G', 'A', 'B', 'C', 'D', 'F', 'E']);
    });
  });
});
