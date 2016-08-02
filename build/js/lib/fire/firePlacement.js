var fire_list = [];
var fire_count = 0;

var pointlight_list = [];
var smoke_list = [];
var fire_mesh_list = [];
var fire_collision_box_list = [];

var smoke_and_light_count = 0;

var fireElapsed;

var fire;
var fireWidth = -1;
var fireHeight = -1;
var fireDepth = -1;
var sliceSpacing = -1;

var clock = new THREE.Clock();

// this function is used in addFire. Don't use it anywhere else.
function initFire() {
    fire = new VolumetricFire(
        fireWidth,
        fireHeight,
        fireDepth,
        sliceSpacing,
        camera
    );

    // Feuer wird für die animate Funktion in ein Array gelegt
    fire_list.push(fire);
    fire_count++;
}

// Adds a fire with a pointlight and smoke to the scene. For better performance
// fire objects with same size only exist once and their meshes are cloned.
function addFire(x, y, z, width, height, depth, spacing) {

    // Compare to last used fire
    if (fireWidth != width || fireHeight != height || fireDepth != depth || sliceSpacing != spacing) {

        var exists = false;

        // Check if the fire exists in the Array. If it does use the existing one.
        for (i = 0; i < fire_count; i++) {
            if (fire_list[i]._width == width && fire_list[i]._height == height &&
                fire_list[i]._depth == depth && fire_list[i]._sliceSpacing == spacing) {
                fire = fire_list[i];
                fireWidth = fire._width;
                fireHeight = fire._height;
                fireDepth = fire._depth;
                sliceSpacing = fire._sliceSpacing;
                exists = true;
                break;
            }
        }

        if (exists == false) {
            //Create new fire
            fireWidth = width;
            fireHeight = height;
            fireDepth = depth;
            sliceSpacing = spacing;
            initFire();
        }
    }
    // Pointlight
    var pointlight;
    if(fireDepth > fireWidth) {
        pointlight = new THREE.PointLight(0xff9933, 1, fireWidth, 2);
    }else{
        pointlight = new THREE.PointLight(0xff9933, 1, fireDepth, 2);
    }
    pointlight.position.set(x, y + fireHeight / 2, z);
    scene.add(pointlight);

    // Firemesh
    var fmesh = fire.mesh.clone();
    scene.add(fmesh);
    fmesh.position.set(x, y + fireHeight / 2, z);
    fire_mesh_list.push(fmesh);

    var fireGeom;
    // Collision Box
    if (fireHeight < (PLAYERHEIGHT * 2)){
        fireGeom = new THREE.BoxGeometry(fireWidth, PLAYERHEIGHT * 2, fireDepth);
    }else{
        fireGeom = new THREE.BoxGeometry(fireWidth, fireHeight, fireDepth);
    }
    var mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    var fireMesh = new THREE.Mesh(fireGeom, mat);

    // create fire sound
    var firecracking = createPositionalSound("firecracking", 50, 5, true, 3, function() {
        fireMesh.add(firecracking);
        playSound(firecracking);
    });

    var box = new GameObject(fireMesh, extinguish, TYPE_FIRE, "fire");

    box.mesh.position.x = x;
    box.mesh.position.y = y;
    box.mesh.position.z = z;

    scene.add(box.mesh);
    modifyOctree(box);

    fire_collision_box_list.push(box);

    var smoke = addSmoke(x, y, z);

    // Push smoke und light in Array
    pointlight_list.push(pointlight);
    smoke_list.push(smoke);
    smoke_and_light_count++;

}

// Call this function once after all the fires have been added to the scene
function animateFire() {

    requestAnimationFrame(animateFire);

     fireElapsed = clock.getElapsedTime();

    // update alle fire Objekte aus dem Array
    for (i = 0; i < fire_count; i++) {
        fire_list[i].update(fireElapsed);
    }

    // update alle smoke und pointlights
    for (j = 0; j < smoke_and_light_count; j++) {

        pointlight_list[j].intensity = Math.sin(fireElapsed * 30) * 0.25 + 3;

        smoke_list[j].material.uniforms.time.value = clock.getElapsedTime();
    }
}

function delFire(fireColBox) {

    var fire_found = false;
    var index = 0;

    for (i = 0; i < smoke_and_light_count; i++) {
        if (fire_collision_box_list[i] == fireColBox) {
            fire_found = true;
            index = i;
            break;
        }
    }

    if (fire_found == false) {
        console.log('error in delFire');
        console.log(index);
        console.log(smoke_and_light_count);
    }else{

        fireColBox.delFromScene();
        octree.remove(fireColBox.mesh);
        scene.remove(pointlight_list[index]);
        scene.remove(smoke_list[index]);
        scene.remove(fire_mesh_list[index]);
        fireColBox.mesh.children[0].stop();
/*
        fire_collision_box_list.splice(index,1);
        pointlight_list.splice(index,1);
        smoke_list.splice(index,1);
        fire_mesh_list.splice(index,1);

        smoke_and_light_count--;
*/
    }



}
