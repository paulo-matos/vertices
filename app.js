import * as THREE from 'three';

let scene, camera, renderer;
let vertices = [];
let lines = [];
let currentLine;

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add initial vertices
    addVertex(0, 0, 0);
    addVertex(2, 2, 0);
    addVertex(-2, 2, 0);

    // Draw lines between vertices
    drawLines();
}

function addVertex(x, y, z) {
    const vertex = new THREE.Vector3(x, y, z);
    vertices.push(vertex);

    if (vertices.length > 1) {
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const geometry = new THREE.BufferGeometry().setFromPoints([vertices[vertices.length - 2], vertex]);
        const line = new THREE.Line(geometry, material);
        lines.push(line);
        scene.add(line);
    }
}

function drawLines() {
    if (lines.length > 0) {
        currentLine = lines.shift();
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (currentLine) {
        const positions = currentLine.geometry.attributes.position.array;
        const start = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const end = new THREE.Vector3(positions[3], positions[4], positions[5]);

        // Interpolation factor (can be adjusted for speed)
        const alpha = 0.01;
        const newEnd = start.clone().lerp(end, alpha);

        positions[3] = newEnd.x;
        positions[4] = newEnd.y;
        positions[5] = newEnd.z;

        currentLine.geometry.attributes.position.needsUpdate = true;

        if (newEnd.distanceTo(end) < 0.01) {
            currentLine = null;
            drawLines();
        }
    }
}

// Resize the renderer with the window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
