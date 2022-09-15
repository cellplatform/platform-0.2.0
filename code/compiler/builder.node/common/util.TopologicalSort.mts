/**
 *
 * Original Source:
 *    "Data Structure" samples.
 *    https://github.com/harishRK/DataStructures
 *
 */
export const TopologicalSort = {
  /**
   * Determine if a cycle exists within the given graph.
   * @param list Adjacency List representing a graph with vertices and edges.
   */
  hasLoop(list: Map<string, string[]>): boolean {
    let count = 0;
    let inDegree: Map<string, number> = new Map();

    // find in-degree for each vertex
    list.forEach((edges, vertex) => {
      // If vertex is not in the map, add it to the inDegree map.
      if (!inDegree.has(vertex)) {
        inDegree.set(vertex, 0);
      }

      edges.forEach((edge) => {
        // Increase the inDegree for each edge.
        if (inDegree.has(edge)) {
          inDegree.set(edge, (inDegree.get(edge) ?? 0) + 1);
        } else {
          inDegree.set(edge, 1);
        }
      });
    });

    // Queue for holding vertices that has 0 inDegree Value
    let queue: string[] = [];
    inDegree.forEach((degree, vertex) => {
      // Add vertices with inDegree 0 to the queue.
      if (degree == 0) queue.push(vertex);
    });

    // Traverse through the leaf vertices.
    while (queue.length > 0) {
      let current = queue.shift();
      count++; // Increase the visited node count.

      // Mark the current vertex as visited and decrease the inDegree for the edges of the vertex
      // Indicates the deletion of this current vertex from the graph,
      // by which the edges from this vertex also gets deleted. Once the edges are deleted, inDegree will also be reduced.
      if (list.has(current ?? '')) {
        (list.get(current ?? '') ?? []).forEach((edge) => {
          if (inDegree.has(edge) && (inDegree.get(edge) ?? 0) > 0) {
            // Decrease the inDegree for the adjacent vertex
            let newDegree = (inDegree.get(edge) ?? 0) - 1;
            inDegree.set(edge, newDegree);

            // if inDegree becomes zero, we found new leaf node.
            // Add to the queue to traverse through its edges
            if (newDegree == 0) {
              queue.push(edge);
            }
          }
        });
      }
    }
    return !(count == inDegree.size);
  },

  /**
   * BFS (Breadth-First-Search)
   * Topological ordering of vertices gor a given directed acyclic graph
   * @param list Adjacency List representing a graph with vertices and edges.
   */
  bfs(list: Map<string, string[]>): string[] {
    const sort: string[] = [];
    const inDegree = new Map<string, number>();

    // find in-degree for each vertex.
    list.forEach((edges, vertex) => {
      // If vertex is not in the map, add it to the inDegree map.
      if (!inDegree.has(vertex)) inDegree.set(vertex, 0);

      edges.forEach((edge) => {
        // Increase the inDegree for each edge.
        if (inDegree.has(edge)) {
          inDegree.set(edge, inDegree.get(edge) ?? 0 + 1);
        } else {
          inDegree.set(edge, 1);
        }
      });
    });

    // Queue for holding vertices that has 0 inDegree Value.
    let queue: string[] = [];
    inDegree.forEach((degree, vertex) => {
      // Add vertices with inDegree 0 to the queue.
      if (degree == 0) queue.push(vertex);
    });

    // Traverse through the leaf vertices.
    while (queue.length > 0) {
      let current = queue.shift() ?? '';
      sort.push(current);

      // Mark the current vertex as visited and decrease the inDegree for the edges of the vertex
      // This indicates the deletion of this current vertex from the graph.
      if (list.has(current)) {
        (list.get(current) ?? []).forEach((edge) => {
          if (inDegree.has(edge) && (inDegree.get(edge) ?? 0) > 0) {
            // Decrease the inDegree for the adjacent vertex
            let newDegree = (inDegree.get(edge) ?? 0) - 1;
            inDegree.set(edge, newDegree);

            // If inDegree becomes zero, we found new leaf node
            // add to the queue to traverse through its edges.
            if (newDegree == 0) queue.push(edge);
          }
        });
      }
    }
    return sort;
  },

  /**
   * DFS (Depth-First-Search)
   * For a given directed acyclic graph, topological ordering of the vertices will be identified using DFS
   * @param list Adjacency List representing a graph with vertices and edges.
   */
  dfs(list: Map<string, string[]>): string[] {
    let order: string[] = [];
    let visited: Set<string> = new Set<string>();
    let allVertices: Set<string> = new Set<string>();

    // Find all vertices in the give graph.
    list.forEach((edges, vertex) => {
      allVertices.add(vertex);
      edges.forEach((edge) => allVertices.add(edge));
    });

    // If we have vertices that are not visited yet.
    for (let vertex of allVertices.keys()) {
      if (!visited.has(vertex)) DFSTraversal(vertex, visited, order, list);
    }

    return order;
  },
};

/**
 * Helpers
 */

function DFSTraversal(
  currentVertex: string,
  visited: Set<string>,
  order: string[],
  list: Map<string, string[]>,
) {
  visited.add(currentVertex);

  // If current vertex has any edges.
  if (list.has(currentVertex)) {
    // For edge of the current vertex.
    (list.get(currentVertex) ?? []).forEach((edgeVertex) => {
      // If the edgeVertex is not visited already.
      if (!visited.has(edgeVertex)) {
        DFSTraversal(edgeVertex, visited, order, list); // <== RECURSION 🌳
      }
    });
  }
  // Prepend the current vertex to the sort result
  order.unshift(currentVertex);
}
