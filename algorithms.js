/**
 * Smart Ambulance Dispatch & Route Optimization
 * Core Algorithms: Dijkstra's and A* (with priority queue)
 * Subject: Design and Analysis of Algorithms
 */

// ─── Min-Heap Priority Queue ───────────────────────────────────────────────
class MinHeap {
  constructor() { this.heap = []; }

  push(node) {
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  isEmpty() { return this.heap.length === 0; }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].cost <= this.heap[i].cost) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].cost < this.heap[smallest].cost) smallest = l;
      if (r < n && this.heap[r].cost < this.heap[smallest].cost) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// ─── Dijkstra's Algorithm ──────────────────────────────────────────────────
/**
 * Finds shortest path from source to all nodes in weighted graph.
 * Time:  O((V + E) log V)
 * Space: O(V)
 *
 * @param {Map} graph  - adjacency list: nodeId -> [{to, weight}]
 * @param {string} src - source node id
 * @returns {{ dist, prev, visited }} - distances, previous-node map, visit order
 */
function dijkstra(graph, src) {
  const dist = new Map();
  const prev = new Map();
  const visited = [];
  const pq = new MinHeap();

  for (const node of graph.keys()) dist.set(node, Infinity);
  dist.set(src, 0);
  pq.push({ cost: 0, id: src });

  while (!pq.isEmpty()) {
    const { cost, id } = pq.pop();
    if (cost > dist.get(id)) continue;
    visited.push(id);

    for (const { to, weight } of (graph.get(id) || [])) {
      const newDist = dist.get(id) + weight;
      if (newDist < dist.get(to)) {
        dist.set(to, newDist);
        prev.set(to, id);
        pq.push({ cost: newDist, id: to });
      }
    }
  }

  return { dist, prev, visited };
}

// ─── A* Algorithm ─────────────────────────────────────────────────────────
/**
 * Finds optimal path from src to dst using heuristic (Euclidean distance).
 * Time:  O(E log V) average, O(V²) worst
 * Space: O(V)
 *
 * @param {Map}    graph    - adjacency list
 * @param {string} src      - source node id
 * @param {string} dst      - destination node id
 * @param {Map}    coords   - nodeId -> { x, y } coordinates for heuristic
 * @returns {{ path, cost, visited }}
 */
function aStar(graph, src, dst, coords) {
  const gScore = new Map();
  const fScore = new Map();
  const prev   = new Map();
  const visited = [];
  const pq     = new MinHeap();
  const closed  = new Set();

  const heuristic = (a, b) => {
    const ca = coords.get(a), cb = coords.get(b);
    return Math.hypot(ca.x - cb.x, ca.y - cb.y);
  };

  for (const node of graph.keys()) {
    gScore.set(node, Infinity);
    fScore.set(node, Infinity);
  }
  gScore.set(src, 0);
  fScore.set(src, heuristic(src, dst));
  pq.push({ cost: fScore.get(src), id: src });

  while (!pq.isEmpty()) {
    const { id } = pq.pop();
    if (closed.has(id)) continue;
    closed.add(id);
    visited.push(id);

    if (id === dst) break;

    for (const { to, weight } of (graph.get(id) || [])) {
      if (closed.has(to)) continue;
      const tentativeG = gScore.get(id) + weight;
      if (tentativeG < gScore.get(to)) {
        prev.set(to, id);
        gScore.set(to, tentativeG);
        fScore.set(to, tentativeG + heuristic(to, dst));
        pq.push({ cost: fScore.get(to), id: to });
      }
    }
  }

  // Reconstruct path
  const path = [];
  let cur = dst;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev.get(cur);
  }

  const valid = path[0] === src;
  return {
    path: valid ? path : [],
    cost: valid ? gScore.get(dst) : Infinity,
    visited
  };
}

// ─── Reconstruct Path from Dijkstra ───────────────────────────────────────
function reconstructPath(prev, src, dst) {
  const path = [];
  let cur = dst;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev.get(cur);
  }
  return path[0] === src ? path : [];
}

// ─── Dispatch Optimizer ───────────────────────────────────────────────────
/**
 * Finds the nearest available ambulance to an emergency using A*.
 * @param {Array}  ambulances - [{ id, nodeId, available }]
 * @param {string} emergency  - node id of emergency
 * @param {Map}    graph
 * @param {Map}    coords
 * @returns {{ ambulanceId, path, cost, algorithm }}
 */
function dispatchOptimal(ambulances, emergency, graph, coords) {
  let best = null;

  for (const amb of ambulances) {
    if (!amb.available) continue;

    const result = aStar(graph, amb.nodeId, emergency, coords);
    if (result.cost < Infinity && (!best || result.cost < best.cost)) {
      best = { ambulanceId: amb.id, ...result, algorithm: 'A*' };
    }
  }

  return best;
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.Algorithms = { dijkstra, aStar, reconstructPath, dispatchOptimal, MinHeap };
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = { dijkstra, aStar, reconstructPath, dispatchOptimal, MinHeap };
}
