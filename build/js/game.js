// Controls camera via WASD/Mouse, enables player to jump, run and crouch

// ---- NOTES FOR USAGE----

// IF YOU WANT COLLISION TO WORK, ADD YOUR OBJECTS TO "terrain" WHEN CREATING ENVIRONMENT
//      example: var meshX = new THREE.Mesh(geom, material);
//      terrain.push(meshX);

// create controls in createScene() with:
//      var camPos = new THREE.Vector3(0,PLAYERHEIGHT,0);
//      controls = new THREE.PointerLockControls(camera,camPos);
//      scene.add(controls.getObject());

// CAMERA needs to be at 0,0,0 - change PLAYERHEIGHT in firstPerson if needed

// call initControls() in init()
// call controlLoop(controls) in loop()



window.addEventListener('load', init, false);


var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container, controls;



var pathItem = '../avz_model/materials/objects/';
//variable used for increasing fog
var myfog=0;
var fogTime=5;
var fogIncrement= 0.015/(fogTime*1000/10) ;
var fogInterval;



function init(event) {

    // set up the scene, the camera and the renderer
    createScene();

    // YOU NEED TO CALL THIS
    initControls();

    // add the objects and lights - replace those functions as you please
    createRoom();
    createLights();

    createFire();

    // start a loop that will update the objects' positions
    // and render the scene on each frame
    loop();
}


// Stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


function createScene() {


    container = document.getElementById('world');

    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0x424242, 0.00002 + myfog);

    fogInterval = setInterval(function () {
            myfog += fogIncrement;
            console.log(myfog);

    }, 10);

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    // Set the position of the camera, PLAYERHEIGHT is defined in firstPerson.js
    var camPos = new THREE.Vector3(0, PLAYERHEIGHT+10  , 0);
    controls = new THREE.PointerLockControls(camera, camPos);
    scene.add(controls.getObject());

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,

        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;

    // Add the DOM element of the renderer to the
    // container we created in the HTML
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}



function loop() {
    stats.begin();
    requestAnimationFrame(loop);



    scene.fog.density= myfog;

    // YOU NEED TO CALL THIS (srycaps)
    controlLoop(controls);
    interactionLoop();

    renderer.render(scene, camera);
    stats.end();
};


function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


var hemisphereLight, shadowLight;




// TEST ENVIRONMENT

function createLights() {

    // A hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // Set the direction of the light
    shadowLight.position.set(50, 50, 50);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}


function createRoom() {
    var jloader2 = new THREE.JSONLoader();
    jloader2.load('test_level.json', function(geo, mat){
        var materials = new THREE.MeshFaceMaterial( mat );
        var mesh = new THREE.Mesh(geo, materials);
        terrain.push(mesh);
        mesh.position.y=0;
        mesh.position.x=5;
        mesh.scale.set(20,20,20);
        scene.add( mesh );
    });



var itemList = ['Axe.json', 'toilett_open_with_door.json', 'plant.json', 'OHP.json'];
     addItem(pathItem.concat(itemList[0]), 0, 5, 10, 2, true);
     addItem(pathItem.concat(itemList[1]), 20, 5, 10, 1, true);
     addItem(pathItem.concat(itemList[2]), 0, 5, 20, 3, true);
     addItem(pathItem.concat(itemList[3]), 0, 5, -10, 3, true);



}


// Add Object with given Path to given coordinates
function addItem(file, xPos, yPos, zPos, scale, interact){
        var jloader2 = new THREE.JSONLoader();
    jloader2.load(file, function(geo, mat){
        var materials = new THREE.MeshFaceMaterial( mat );
        var mesh = new THREE.Mesh(geo, materials);

        mesh.position.y=yPos;
        mesh.position.x=xPos;
        mesh.position.z = zPos;
        mesh.scale.set(20*scale,20*scale,20*scale);
        if(interact){
            var intItem = new gameObject(mesh, 0, interact);
            terrain.push(intItem);
        }
        else{
            terrain.push(mesh);
        }

        scene.add( mesh );

    });
}



function createFire() {
    VolumetricFire.texturePath = './levels/materials/textures/';

    addFire(80,30,1,30,30,30,10);
    fireGeom = new THREE.BoxGeometry(30,30,30);
    var mat = new THREE.MeshLambertMaterial({color: 0xFFFFFF,opacity:0} )
    var box = new GameObject(new THREE.Mesh(fireGeom,mat),null,TYPE_FIRE);

    box.mesh.position.x=80;

    box.mesh.position.y=30;

    box.mesh.position.z=1;

    scene.add(box.mesh);
    terrain.push(box);



    animateFire();

}
