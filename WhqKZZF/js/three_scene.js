let scene, camera, renderer, particles;
let puzzlePieces = [];
let clickCallback = null;

function initScene(container) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    createParticleBackground();
    
    camera.position.z = 5;
    
    animate();
    
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('mousemove', onMouseMove);
}

function createParticleBackground() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x64FFDA,
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function addPieceToPuzzle(pieceData) {
    const existingPiece = puzzlePieces.find(p => p.userData.id === pieceData.id);
    if (existingPiece) return;
    
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x64FFDA, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const piece = new THREE.Mesh(geometry, material);
    piece.userData = pieceData;
    
    const angle = puzzlePieces.length * (Math.PI * 2 / 8);
    const radius = 3;
    piece.position.x = Math.cos(angle) * radius;
    piece.position.y = Math.sin(angle) * radius;
    piece.position.z = Math.random() * 0.5 - 0.25;
    
    piece.scale.set(0, 0, 0);
    
    scene.add(piece);
    puzzlePieces.push(piece);
    
    gsap.to(piece.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
    });
    
    gsap.to(piece.rotation, {
        x: Math.random() * 0.3,
        y: Math.random() * 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

function clearScene() {
    puzzlePieces.forEach(piece => {
        if (scene && piece) {
            scene.remove(piece);
            if (piece.geometry) piece.geometry.dispose();
            if (piece.material) piece.material.dispose();
        }
    });
    puzzlePieces = [];
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onCanvasClick(event) {
    if (!clickCallback) return;
    
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(puzzlePieces);
    if (intersects.length > 0) {
        const clickedPiece = intersects[0].object;
        clickCallback(clickedPiece.userData.id);
    }
}

function onMouseMove(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(puzzlePieces);
    
    puzzlePieces.forEach(piece => {
        gsap.to(piece.material, { opacity: 0.8, duration: 0.2 });
    });
    
    if (intersects.length > 0) {
        const hoveredPiece = intersects[0].object;
        gsap.to(hoveredPiece.material, { opacity: 1, duration: 0.2 });
        document.body.style.cursor = 'pointer';
        showTooltip(event, hoveredPiece.userData.description);
    } else {
        document.body.style.cursor = 'default';
        hideTooltip();
    }
}

function showTooltip(event, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY - 30 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.y += 0.001;
    }
    
    puzzlePieces.forEach(piece => {
        piece.rotation.z += 0.005;
    });
    
    renderer.render(scene, camera);
}

function setClickCallback(callback) {
    clickCallback = callback;
}

export { initScene, addPieceToPuzzle, clearScene, setClickCallback };
