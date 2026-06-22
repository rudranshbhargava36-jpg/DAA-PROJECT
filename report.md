# Algorithm Analysis Report
## Smart Ambulance Dispatch & Route Optimization

---

## 1. Problem Statement

Given a city modeled as a weighted graph G = (V, E), where:
- V = set of intersections/locations
- E = set of roads with travel-time weights
- A set of ambulances at known positions
- An emergency at node d ∈ V

**Goal:** Find the ambulance a* and path P such that cost(a*.position → d) is minimized.

---

## 2. Data Structures Used

### 2.1 Graph Representation
**Adjacency List** — chosen over adjacency matrix because:
- Sparse graph: |E| << |V|²  
- Space: O(V + E) vs O(V²) for matrix  
- Faster iteration over neighbors: O(degree(v)) vs O(V)

### 2.2 Min-Heap Priority Queue
Custom binary min-heap for O(log n) extract-min operations.

**Operations:**
| Operation | Time |
|---|---|
| push(node) | O(log n) |
| pop() | O(log n) |
| peek() | O(1) |

---

## 3. Dijkstra's Algorithm

### 3.1 Description
Greedy algorithm that processes nodes in order of increasing distance from source. Maintains a set of "relaxed" distances and updates them as shorter paths are found.

### 3.2 Pseudocode
```
DIJKSTRA(Graph G, source s):
  dist[v] = ∞  for all v ∈ V
  dist[s] = 0
  PQ = MinHeap{(0, s)}
  
  while PQ not empty:
    (cost, u) = PQ.pop()
    if cost > dist[u]: continue   // stale entry
    
    for each (v, w) in G.adj[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        prev[v] = u
        PQ.push((dist[v], v))
  
  return dist, prev
```

### 3.3 Complexity Analysis
- **Time:** O((V + E) log V) with binary heap
- **Space:** O(V) for dist[], prev[], and heap

### 3.4 Correctness
Dijkstra is correct for non-negative edge weights (proven by induction on the number of finalized nodes). All edge weights in this system are positive (travel times ≥ 0).

---

## 4. A* Algorithm

### 4.1 Description
Informed search that combines actual cost g(n) from source with estimated cost h(n) to destination. Total priority: f(n) = g(n) + h(n).

### 4.2 Heuristic Function
**Euclidean distance** between GPS/canvas coordinates:

```
h(n) = sqrt((x_n - x_goal)² + (y_n - y_goal)²)
```

**Admissibility:** h(n) ≤ true_cost(n → goal) ✓  
(Straight-line distance never overestimates road distance)

**Consistency:** h(n) ≤ cost(n, n') + h(n') ✓  
(Triangle inequality holds for Euclidean distance)

Since h is admissible and consistent, A* is **optimal**.

### 4.3 Pseudocode
```
A_STAR(Graph G, source s, destination d, coords):
  g[v] = ∞  for all v ∈ V
  g[s] = 0
  f[s] = h(s, d)
  PQ = MinHeap{(f[s], s)}
  closed = {}

  while PQ not empty:
    (_, u) = PQ.pop()
    if u in closed: continue
    closed.add(u)
    
    if u == d: break   // found optimal path
    
    for each (v, w) in G.adj[u]:
      if v in closed: continue
      tentative_g = g[u] + w
      if tentative_g < g[v]:
        g[v] = tentative_g
        f[v] = g[v] + h(v, d)
        prev[v] = u
        PQ.push((f[v], v))
  
  return reconstruct_path(prev, s, d), g[d]
```

### 4.4 Complexity Analysis
- **Time:** O(E log V) average; O(V²) worst case (poor heuristic)
- **Space:** O(V)

---

## 5. Dispatch Algorithm

```
DISPATCH(ambulances, emergency, G, coords):
  best = null
  
  for each ambulance a (available):
    result = A_STAR(G, a.position, emergency, coords)
    if result.cost < best.cost:
      best = (a, result)
  
  return best
```

**Time:** O(A × E log V) where A = number of available ambulances  
In practice A ≤ 10, so this is efficient.

---

## 6. Experimental Results

| Scenario | Algorithm | Nodes Visited | ETA (s) |
|---|---|---|---|
| Light traffic (1×) | A* | ~6 | ~120 |
| Light traffic (1×) | Dijkstra | ~12 | ~120 |
| Heavy traffic (3×) | A* | ~6 | ~360 |
| Heavy traffic (3×) | Dijkstra | ~12 | ~360 |

**Observation:** A* visits ~50% fewer nodes than Dijkstra for the same optimal path — demonstrating the benefit of the heuristic in sparse city graphs.

---

## 7. Conclusion

A* is the preferred algorithm for single-target dispatch because:
1. Same optimal guarantee as Dijkstra (with admissible heuristic)
2. Visits significantly fewer nodes (faster in practice)
3. Scales better as city graph grows

Dijkstra remains useful for computing all-pairs distances (e.g., precomputing nearest hospital from every intersection).
