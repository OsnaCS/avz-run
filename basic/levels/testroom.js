/* TEXTURES */

/// / instantiate texture loader
var tl = new THREE.TextureLoader();

// stone texture
var stone = tl.load("textures/stonefloor.jpg");
stone.wrapS = THREE.RepeatWrapping;
stone.wrapT = THREE.RepeatWrapping;
stone.repeat.set(10, 40);
var stoneMaterial = new THREE.MeshStandardMaterial({
    map: stone,
    side: THREE.DoubleSide
});

// wall texture
var wall = new THREE.TextureLoader().load("textures/wall.jpg");
wall.wrapS = THREE.RepeatWrapping;
wall.wrapT = THREE.RepeatWrapping;
wall.repeat.set(1, 1);
var wallMaterial = new THREE.MeshStandardMaterial({
    map: wall,
    side: THREE.DoubleSide
});

// wall texture transparent
var wallMaterialTransparent = new THREE.MeshStandardMaterial({
    map: wall,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
});

/* GEOMETRIES */
var plane, geometry;

// bottom
geometry = new THREE.PlaneGeometry(3, 20);
geometry.rotateX(1.57);
plane = new THREE.Mesh(geometry, stoneMaterial);
plane.doubleSided = true;
scene.add(plane);

// top
geometry = new THREE.PlaneGeometry(3, 20);
geometry.rotateX(1.57);
geometry.translate(0,2.5,0);
plane = new THREE.Mesh(geometry, wallMaterial);
plane.doubleSided = true;
scene.add(plane);

// right
geometry = new THREE.PlaneGeometry(2.5, 20);
geometry.rotateX(1.57);
geometry.rotateZ(1.57);
geometry.translate(-1.5,1.25,0);
plane = new THREE.Mesh(geometry, wallMaterial);
plane.doubleSided = true;
scene.add(plane);

// left
geometry = new THREE.PlaneGeometry(2.5, 20);
geometry.rotateX(1.57);
geometry.rotateZ(1.57);
geometry.translate(1.5,1.25,0);
plane = new THREE.Mesh(geometry, wallMaterial);
plane.doubleSided = true;
scene.add(plane);

// back
geometry = new THREE.PlaneGeometry(3, 2.5);
geometry.translate(0, 1.25, 10);
plane = new THREE.Mesh(geometry, wallMaterial);
plane.doubleSided = true;
scene.add(plane);

// // front
geometry = new THREE.PlaneGeometry(3, 2.5);
geometry.translate(0, 1.25, -10);
plane = new THREE.Mesh(geometry, wallMaterialTransparent);
plane.doubleSided = true;
scene.add(plane);
