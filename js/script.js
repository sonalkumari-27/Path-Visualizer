class Graph {
    constructor() {
        this.nodes = new Set();
        this.adjacencyList = new Map();
    }
    addNode(node) {
        this.nodes.add(node);
        this.adjacencyList.set(node, []);
    }
    addEdge(node1, node2, weight) {
        if (!this.adjacencyList.has(node1) || !this.adjacencyList.has(node2)) {
            alert('Both cities must exist in the graph');
            return;
        }
        this.adjacencyList.get(node1).push({ node: node2, weight: weight });
        this.adjacencyList.get(node2).push({ node: node1, weight: weight });
    }
    dijkstra(startNode, endNode) {
        let distances = {};
        let prev = {};
        let pq = new PriorityQueue();
        distances[startNode] = 0;
        pq.enqueue(startNode, 0);
        this.nodes.forEach(node => {
            if (node !== startNode) distances[node] = Infinity;
            prev[node] = null;
        });
        while (!pq.isEmpty()) {
            let minNode = pq.dequeue().element;
            if (minNode === endNode) break;
            this.adjacencyList.get(minNode).forEach(neighbor => {
                let alt = distances[minNode] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    prev[neighbor.node] = minNode;
                    pq.enqueue(neighbor.node, alt);
                }
            });
        }
        let path = [];
        let u = endNode;
        while (prev[u]) {
            path.unshift(u);
            u = prev[u];
        }
        path.unshift(startNode);
        return path;
    }
}
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        let qElement = new QElement(element, priority);
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
    }
    dequeue() {
        if (this.isEmpty()) return "Underflow";
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}
const graph = new Graph();
const nodes = ['Kolkata','Asansol','Siliguri','Durgapur','Howrah','Malda','Kharagpur','Medinipur','Haldia','Bardhaman','Cooch Behar','Krishnanagar','Purulia','Bankura','Digha','Jhargram'];
nodes.forEach(node => graph.addNode(node));
graph.addEdge('Kolkata', 'Howrah', 20);
graph.addEdge('Kolkata', 'Haldia', 70);
graph.addEdge('Howrah', 'Bardhaman', 100);
graph.addEdge('Howrah', 'Bankura', 210);
graph.addEdge('Bardhaman', 'Durgapur', 80);
graph.addEdge('Durgapur', 'Asansol', 60);
graph.addEdge('Durgapur', 'Bankura', 50);
graph.addEdge('Asansol', 'Bankura', 70);
graph.addEdge('Bardhaman', 'Bankura', 100);
graph.addEdge('Howrah', 'Medinipur', 120);
graph.addEdge('Howrah', 'Kharagpur', 120);
graph.addEdge('Medinipur', 'Kharagpur', 20);
graph.addEdge('Haldia', 'Kharagpur', 100);
graph.addEdge('Bankura', 'Purulia', 90);
graph.addEdge('Bankura', 'Medinipur', 110);
graph.addEdge('Asansol', 'Purulia', 85);
graph.addEdge('Medinipur', 'Purulia', 170);
graph.addEdge('Kolkata', 'Krishnanagar', 140);
graph.addEdge('Howrah', 'Malda', 340);
graph.addEdge('Krishnanagar', 'Malda', 220);
graph.addEdge('Siliguri', 'Malda', 250);
graph.addEdge('Siliguri', 'Cooch Behar', 140);
graph.addEdge('Kharagpur', 'Digha', 110);
graph.addEdge('Kharagpur', 'Jhargram', 50);
graph.addEdge('Medinipur', 'Jhargram', 30);
graph.addEdge('Purulia', 'Jhargram', 140);

const coordinates = {
    'Kolkata': { x: 450, y: 460 }, 
    'Asansol': { x: 100, y: 200 },
    'Siliguri': { x: 390, y: 50 },
    'Durgapur': { x: 200, y: 250 },
    'Howrah': { x: 420, y: 410 },
    'Malda': { x: 380, y: 160 },
    'Kharagpur': { x: 350, y: 520 },
    'Medinipur': { x: 330, y: 460 },
    'Bardhaman': { x: 300, y: 320 },
    'Cooch Behar': { x: 435, y: 100 },
    'Purulia': { x: 50, y: 350 },
    'Haldia': { x: 440, y: 550 },
    'Krishnanagar': { x: 430, y: 220 },
    'Bankura': { x: 160, y: 320 },
    'Digha': { x: 300, y: 550 },
    'Jhargram': { x: 250, y: 480 }
};
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const busImage = new Image();
busImage.src = 'js/bus.png';
const maxX = Math.max(...Object.values(coordinates).map(coord => coord.x));
const maxY = Math.max(...Object.values(coordinates).map(coord => coord.y));
canvas.width = maxX + 50; 
canvas.height = maxY + 50;

busImage.onload = function() {
    drawGraph();
    populateCitySelection();
    document.getElementById('notification').textContent = 'Distance traveled: 0 km';
};
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    graph.nodes.forEach(node => {
        graph.adjacencyList.get(node).forEach(neighbor => {
            ctx.beginPath();
            ctx.moveTo(coordinates[node].x, coordinates[node].y);
            ctx.lineTo(coordinates[neighbor.node].x, coordinates[neighbor.node].y);
            ctx.stroke();
            const midX = (coordinates[node].x + coordinates[neighbor.node].x) / 2;
            const midY = (coordinates[node].y + coordinates[neighbor.node].y) / 2;
            ctx.fillText(neighbor.weight, midX, midY);
        });
    });
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    graph.nodes.forEach(node => {
        const { x, y } = coordinates[node];
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(node, x - 20, y - 10);
    });
}
function drawPath(path) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(coordinates[path[0]].x, coordinates[path[0]].y);
    for (let i = 1; i < path.length; i++) {
        const { x, y } = coordinates[path[i]];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}
function moveBus(startNode, endNode) {
    const path = graph.dijkstra(startNode, endNode);
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const node = path[i];
        const neighbor = graph.adjacencyList.get(node).find(n => n.node === path[i + 1]);
        if (neighbor) {
            totalDistance += neighbor.weight;
        }
    }
    let traveledDistance = 0;
    document.getElementById('notification').textContent = `Total distance to be traveled: ${totalDistance} km`;
    drawPath(path);
    let index = 0;
    function animate() {
        if (index < path.length - 1) {
            const start = coordinates[path[index]];
            const end = coordinates[path[index + 1]];
            const duration = 2000;
            const startTime = performance.now();
            function move(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const x = start.x + (end.x - start.x) * progress;
                const y = start.y + (end.y - start.y) * progress;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawGraph();
                drawPath(path); 
                ctx.drawImage(busImage, x - 10, y - 10, 20, 20);
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    index++;
                    animate();
                }
            }
            requestAnimationFrame(move);
        } 
        else {
            drawGraph();
            updateCitySelection();
            document.getElementById('notification').textContent = `Distance traveled: 0 km`;
        }
    }
    setTimeout(animate, 500);
}
function populateCitySelection() {
    const startSelect = document.getElementById('start-city');
    const endSelect = document.getElementById('end-city');
    graph.nodes.forEach(node => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = node;
        option1.text = option2.text = node;
        startSelect.add(option1);
        endSelect.add(option2);
    });
}
function updateCitySelection() {
    const startSelect = document.getElementById('start-city');
    const endSelect = document.getElementById('end-city');
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    populateCitySelection();
}
document.getElementById('visualize-path').addEventListener('click', () => {
    const startCity = document.getElementById('start-city').value;
    const endCity = document.getElementById('end-city').value;
    if (startCity && endCity) {
        moveBus(startCity, endCity);
    }
});
document.getElementById('add-city').addEventListener('click', () => {
    const newCity = document.getElementById('new-city').value;
    if (newCity && !graph.nodes.has(newCity)) {
        graph.addNode(newCity);
        coordinates[newCity] = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
        updateCitySelection();
        drawGraph();
        document.getElementById('new-city').value = '';
    } else {
        alert('City already exists or input is empty.');
    }
});
document.getElementById('add-edge').addEventListener('click', () => {
    const city1 = document.getElementById('edge-city1').value;
    const city2 = document.getElementById('edge-city2').value;
    const weight = parseInt(document.getElementById('edge-weight').value);
    if (city1 && city2 && weight > 0 && graph.nodes.has(city1) && graph.nodes.has(city2)) {
        graph.addEdge(city1, city2, weight);
        drawGraph();
        document.getElementById('edge-city1').value = '';
        document.getElementById('edge-city2').value = '';
        document.getElementById('edge-weight').value = '';
    } else {
        alert('Invalid input. Ensure cities exist and distance is positive.');
    }
});



