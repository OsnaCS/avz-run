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



// First all Files will be loaded
window.addEventListener('load', loadFiles, false);

// Initialize List for Files to load
var newItemList =[];

// Initialize fileLoader
var fileLoader =null;

// Load file-pathes from XML in list
// callback function complete
function loadFiles(){
    makeArrayFromXML(complete, newItemList, "../avz_model/materials/objects.xml");

}

// if XML-Parsing done
function complete(){
    // Load all files in Loader
    fileLoader= new FileLoader();// = new FileLoader();
    // Wait untill ready
    // starts init
    window.setTimeout(init, 150);

}

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container, controls, audioLoader, startInstructions, buttonStart,
    instructions, blocker, button;

var menu = true;
var pause = false;

//variable used for increasing fog
var MAX_FOG = 0.015;
var myfog=0.002;
var fogTime=20;
var fogIncrement= MAX_FOG/(fogTime*1000/10) ;
var fogInterval;
var HEALTH_PER_SECOND = 10; // if fog is at final density you lose this much health

// creates everything and start the loop
function init(event) {

    // set up the scene, the camera and the renderer
    createScene();

    // init audio support
    createAudio();

    // YOU NEED TO CALL THIS
    initControls();

    // add the objects and lights - replace those functions as you please
    createRoom();

    // set up items
    createItems();

    // set up lights
    createLights();

    // set up fire
    createFire();

    // start a loop that will update the objects' positions
    // and render the scene on each frame
    loop();
}

// Stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Create the Scene
function createScene() {

    blocker = document.getElementById('blocker');
    container = document.getElementById('world');
    startInstructions = document.getElementById('startInstructions');
    buttonStart = document.getElementById('buttonStart');
    instructions = document.getElementById('instructions');
    button = document.getElementById('button');
    button2 = document.getElementById('button2');

    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0x424242, 0.00002 + myfog);

    fogInterval = setInterval(function() {
        if (!menu && !pause) {
            player.damage(myfog / MAX_FOG) * (HEALTH_PER_SECOND / 100);

            if (myfog < MAX_FOG) {
                myfog += fogIncrement;
            }
        }
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
    var camPos = new THREE.Vector3(0, PLAYERHEIGHT + 10, 0);
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

    player = new Player();

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);

    scene.fog = new THREE.FogExp2(0x424242, 0.005);
}


function loop() {


    if (!menu && !pause) {
        if (player.health <= 0) {
            gameOver();
        } else {

            stats.begin();
            requestAnimationFrame(loop);
            scene.fog.density = myfog;

            // YOU NEED TO CALL THIS (srycaps)
            controlLoop(controls);
            interactionLoop();

            renderer.render(scene, camera);
            stats.end();
        }
    } else {
        requestAnimationFrame(loop);
    }
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

   var mesh = fileLoader.get("test_level");
    terrain.push(mesh);
    mesh.position.y = 0;
    mesh.position.x = 5;
    mesh.scale.set(20, 20, 20);
    scene.add(mesh);
}


function createItems(){

    addItem((newItemList[0]), -50, 10, 10, 10, 90, true, pickUpItem);
    addItem((newItemList[0]), -50, 10, 10, 10, 0, true, pickUpItem);
    addItem((newItemList[0]), -50, 10, 10, 10, 180, true, pickUpItem);
    addItem((newItemList[40]), 50, 0, 10, 2, 270, false, pickUpItem);
    addItem((newItemList[48]), 0, 0, -700, 1, 0, false, null);

}
addTrigger(-64,-71,action);
function action() {
    console.log("hi");
}

// Add Object with given Path to given coordinates
function addItem(file, xPos, yPos, zPos, scale, angle, interact_type, intfunction){
    var tmpName =  file.split("/");
    var tmpName = tmpName[tmpName.length-1];
    var mesh = (fileLoader.get(tmpName.split(".")[0])).clone();
    var angleObj = (Math.PI*2*angle)/360;
    mesh.position.y = yPos;
    mesh.position.x = xPos;
    mesh.position.z = zPos;
    mesh.scale.set(20*scale,20*scale,20*scale);
    mesh.rotateY(angleObj);

    if(interact_type){
        var intItem = new GameObject(mesh, intfunction, TYPE_INTERACTABLE, file);
        terrain.push(intItem);
    } else {
        terrain.push(mesh);
    }

    scene.add(mesh);

}


function addTrigger (xPos, zPos, action) {
    var triggerGeom = new THREE.BoxGeometry(30,30,30);
    var mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, color:0xFFFFFF});
    var triggerMesh = new THREE.Mesh(triggerGeom,mat);
    var trigger = new GameObject(triggerMesh,action,TYPE_TRIGGER);


    trigger.mesh.position.x = xPos;
    trigger.mesh.position.z = zPos;
    trigger.mesh.position.y = 0;
    scene.add(trigger.mesh);
    terrain.push(trigger);

}

function removeTrigger(trigger) {
    scene.remove(trigger.mesh);
    for (var i =0;i < terrain.length;i++) {
        if(terrain[i]==trigger) {
            terrain.splice(i,1);
        }

    }
}


function createFire() {
    VolumetricFire.texturePath = './levels/materials/textures/';

    addFire(80, 0, 1, 30, 30, 30, 10);

    animateFire();

}
