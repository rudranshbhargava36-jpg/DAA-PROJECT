🔴 **[▶ Live Demo — Click to Run](https://pathanarmaan65-cyber.github.io/DAA-Project-Sem4/)**

# 🚑 Smart Ambulance Dispatch & Route Optimization System
Made by: Rudransh & Armaan

> **Subject:** Design and Analysis of Algorithms (DAA)  
> **Algorithms:** Dijkstra's Algorithm · A\* Search  
> **Tech:** Vanilla HTML/CSS/JavaScript — zero dependencies

---

## 📌 Overview

An interactive web simulation of a city-wide emergency medical dispatch system. It uses **graph algorithms** to find optimal routes from the nearest available ambulance to any emergency location in real-time.

---

## 🧠 Algorithms Implemented

### 1. Dijkstra's Algorithm
- Finds shortest path from source to **all** nodes in the graph
- Uses a **Min-Heap Priority Queue** for efficiency
- **Time Complexity:** O((V + E) log V)
- **Space Complexity:** O(V)
- Guarantees optimal path (shortest weighted path)

### 2. A\* Search Algorithm
- Guided shortest-path algorithm using a **heuristic function**
- Heuristic: **Euclidean distance** (admissible + consistent)
- **Time Complexity:** O(E log V) average
- **Space Complexity:** O(V)
- Faster than Dijkstra in practice due to directed exploration

### Priority Queue (Min-Heap)
Both algorithms use a custom **binary min-heap** implementation:
- `push(node)` — O(log n)
- `pop()` — O(log n)
- Used to always process the lowest-cost node next

---

## 🗺️ City Graph Model

The city is modeled as a **weighted undirected graph**:
- **Nodes** = Road intersections, hospital locations, ambulance bases
- **Edges** = Roads between intersections
- **Weights** = Travel time in seconds (affected by traffic multiplier)

```
Nodes:  15 (hospitals, bases, intersections)
Edges:  30 road segments
Model:  Adjacency list representation
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| Interactive Map | Click road nodes to place emergencies |
| Auto Dispatch | Finds nearest available ambulance automatically |
| Algorithm Toggle | Switch between Dijkstra and A\* live |
| Traffic Simulation | 1×–3× multiplier affects all edge weights |
| Path Animation | Animated route visualization on dispatch |
| Visit Visualization | Highlights nodes explored by the algorithm |
| Dispatch Log | Real-time timestamped log of all events |
| Fleet Management | Ambulances marked busy/available after dispatch |
| Statistics | Tracks dispatches, avg ETA, nodes visited |

---

## 📁 Project Structure

```
ambulance-dispatch/
├── index.html          # Main simulation (UI + canvas renderer)
├── src/
│   ├── algorithms.js   # Dijkstra, A*, MinHeap, dispatchOptimal
│   └── graph.js        # City graph model + adjacency list builder
├── docs/
│   └── report.md       # Algorithm analysis and design document
└── README.md
```

---

## ▶️ How to Run

No build step required. Just open in a browser:

```bash
git clone https://github.com/YOUR_USERNAME/ambulance-dispatch.git
cd ambulance-dispatch
# Open index.html in any modern browser
open index.html
```

Or serve with a local server:

```bash
npx serve .
# OR
python3 -m http.server 8080
```

---

## 🎮 How to Use the Simulation

1. **Place Emergency** — Click any road intersection on the map (blue dot)
2. **Choose Algorithm** — Toggle between Dijkstra / A\* at the bottom
3. **Set Traffic** — Drag the traffic slider (1× = normal, 3× = heavy)
4. **Auto Dispatch** — Click the button; watch the optimal path animate
5. **Reset** — Clear the board and start fresh

---

## 📊 Algorithm Comparison

| | Dijkstra | A\* |
|---|---|---|
| Strategy | Explore all nodes by cost | Explore guided by heuristic |
| Optimal | ✅ Yes | ✅ Yes (with admissible h) |
| Faster in practice | ❌ | ✅ |
| Extra info needed | ❌ | ✅ (coordinates) |
| Best for | All-pairs distances | Single target dispatch |

In this system, **A\* is preferred** for dispatch (single target) because it visits fewer nodes. **Dijkstra** is useful when we need distances to all hospitals simultaneously.

---

## 👨‍💻 Author

Built for DAA coursework — demonstrates practical application of shortest-path algorithms in emergency response systems.
