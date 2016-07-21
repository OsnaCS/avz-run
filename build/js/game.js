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

function init(event) {

    // set up the scene, the camera and the renderer
    createScene();

    // YOU NEED TO CALL THIS
    initControls();

    // add the objects and lights - replace those functions as you please
    createRoom();
    createLights();

    // start a loop that will update the objects' positions
    // and render the scene on each frame
    loop();
}



function createScene() {


    container = document.getElementById('world');

    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // Add a fog effect to the scene; same color as the
    // background color used in the style sheet
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);


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
    var camPos = new THREE.Vector3(0,PLAYERHEIGHT,0);
    controls = new THREE.PointerLockControls(camera,camPos);
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



function loop(){

    requestAnimationFrame(loop);

    // YOU NEED TO CALL THIS (srycaps)
    controlLoop(controls);
    interactionLoop();

    renderer.render(scene, camera);

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
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

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

    var Colors = {
        red:0xf25346,
        white:0xd8d0d1,
        brown:0x59332e,
        pink:0xF5986E,
        brownDark:0x23190f,
        blue:0x68c3c0,
    };

    var cubeGeom = new THREE.BoxGeometry(30,30,30);
    var sphereGeom = new THREE.SphereGeometry();
    var geomFloor = new THREE.BoxGeometry(200,10,200);
    var geomSide = new THREE.BoxGeometry(10,200,200);
    var geomBack = new THREE.BoxGeometry(200,200,10);
    var materialRed = new THREE.MeshLambertMaterial({color:Colors.red,shading:THREE.FlatShading})
    var materialBlue = new THREE.MeshLambertMaterial({color:Colors.blue,shading:THREE.FlatShading})

    var floor = new THREE.Mesh(geomFloor, materialRed);
    var leftWall = new THREE.Mesh(geomSide, materialRed);
    var rightWall = new THREE.Mesh(geomSide, materialRed);
    var backWall = new THREE.Mesh(geomBack, materialRed);

    var cubeMesh = new THREE.Mesh(cubeGeom,materialBlue);

    var cube = new gameObject(cubeMesh, cubeInteraction, true);

    cube.mesh.position.x = 80;
    cube.mesh.position.y = 15;



    leftWall.position.x -= 100;
    leftWall.position.y +=100;
    rightWall.position.x +=100;
    rightWall.position.y +=100;
    backWall.position.z -=100;
    backWall.position.y +=100;
    //floor.position.y -=100;
    terrain.push(rightWall);
    terrain.push(leftWall);
    terrain.push(backWall);
    terrain.push(floor);
    terrain.push(cube);
    cube.mesh.castShadow = true;



    scene.add(cube.mesh);
    scene.add(floor);
    scene.add(leftWall);
    scene.add(rightWall);
    scene.add(backWall);


}
function cubeInteraction() {
    //cube.mesh.material = new
    console.log("click");
}
