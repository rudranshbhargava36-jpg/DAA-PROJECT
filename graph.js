/**
 * City Graph Model
 * Represents a city road network as a weighted undirected graph.
 * Nodes = intersections, Edges = roads (weight = travel time in seconds)
 */

const CITY_GRAPH = {
  nodes: [
    // Hospitals / Dispatch Centers
    { id: 'H1', label: 'City Hospital',    x: 310, y: 120, type: 'hospital' },
    { id: 'H2', label: 'North Clinic',     x: 540, y: 80,  type: 'hospital' },

    // Ambulance Bases
    { id: 'A1', label: 'Base Alpha',       x: 130, y: 200, type: 'base' },
    { id: 'A2', label: 'Base Beta',        x: 480, y: 260, type: 'base' },
    { id: 'A3', label: 'Base Gamma',       x: 260, y: 400, type: 'base' },

    // Intersections / Road Nodes
    { id: 'N1', label: 'Main & 1st',       x: 200, y: 130, type: 'road' },
    { id: 'N2', label: 'Main & 3rd',       x: 310, y: 200, type: 'road' },
    { id: 'N3', label: 'Park Ave',         x: 420, y: 150, type: 'road' },
    { id: 'N4', label: 'Bridge Rd',        x: 200, y: 290, type: 'road' },
    { id: 'N5', label: 'East Cross',       x: 370, y: 310, type: 'road' },
    { id: 'N6', label: 'South Market',     x: 310, y: 390, type: 'road' },
    { id: 'N7', label: 'West End',         x: 130, y: 360, type: 'road' },
    { id: 'N8', label: 'Highway Jct',      x: 480, y: 370, type: 'road' },
    { id: 'N9', label: 'Central Sq',       x: 310, y: 280, type: 'road' },
    { id: 'N10',label: 'North Gate',       x: 420, y: 80,  type: 'road' },
  ],

  // Edges: [from, to, weight(seconds)]
  edges: [
    ['H1',  'N1',  45], ['H1',  'N2',  30], ['H1',  'N3',  60],
    ['H2',  'N10', 25], ['H2',  'N3',  50],
    ['A1',  'N1',  20], ['A1',  'N4',  55],
    ['A2',  'N3',  40], ['A2',  'N5',  35], ['A2',  'N8',  45],
    ['A3',  'N6',  30], ['A3',  'N7',  40],
    ['N1',  'N2',  50], ['N1',  'N4',  60],
    ['N2',  'N3',  55], ['N2',  'N9',  30],
    ['N3',  'N10', 40], ['N3',  'N5',  70],
    ['N4',  'N7',  65], ['N4',  'N9',  55],
    ['N5',  'N6',  50], ['N5',  'N8',  40], ['N5',  'N9',  45],
    ['N6',  'N7',  55], ['N6',  'N8',  60],
    ['N7',  'A3',  40],
    ['N8',  'A2',  45],
    ['N9',  'H1',  60], ['N9',  'N6',  55],
    ['N10', 'H2',  25],
  ]
};

/**
 * Build adjacency list from CITY_GRAPH for algorithm use
 */
function buildGraph(trafficMultiplier = 1.0) {
  const graph = new Map();
  const coords = new Map();

  for (const node of CITY_GRAPH.nodes) {
    graph.set(node.id, []);
    coords.set(node.id, { x: node.x, y: node.y });
  }

  for (const [from, to, weight] of CITY_GRAPH.edges) {
    const w = Math.round(weight * trafficMultiplier);
    graph.get(from).push({ to, weight: w });
    graph.get(to).push({ to: from, weight: w }); // undirected
  }

  return { graph, coords };
}

if (typeof window !== 'undefined') {
  window.CityGraph = { CITY_GRAPH, buildGraph };
}
if (typeof module !== 'undefined') {
  module.exports = { CITY_GRAPH, buildGraph };
}
