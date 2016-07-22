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
    var camPos = new THREE.Vector3(0,PLAYERHEIGHT+1000,0);
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

		var pointLight1 = new THREE.PointLight(0x999999);
		pointLight1.position.set(0.0,0.0,0.0);
		pointLight1.castShadow = true;
		scene.add(pointLight1);

		var pointLight2 = new THREE.PointLight(0x999999);
		pointLight2.position.set(40,10,10);
		pointLight2.castShadow = true;
		scene.add(pointLight2);

		var spotLight = new THREE.SpotLight(0xFFFFFF);
		spotLight.position.set(0.0,5.0,8.0);
		spotLight.castShadow = true;
		scene.add(spotLight);

		var ambientL = new THREE.AmbientLight(0xFFFFFF,0.5);
		scene.add(ambientL);
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
		loadJson(mesh );
	});


	 function loadJson(mesh){
		 scene.add( mesh );
	 }

}
function createFire() {
    VolumetricFire.texturePath = './levels/materials/textures/';
    addSmallFire(0, 0, 0);
    addSmallFire(0, 10, 0);
    addSmallFire(0, 20, 0);
    addSmallFire(0, 30, 0);
    addSmallFire(0, 40, 0);
    addSmallFire(0, 50, 0);
    addSmallFire(0, -10, 0);
    addSmallFire(0, -20, 0);
    addSmallFire(0, -30, 0);
    addSmallFire(0, -40, 0);
    addSmallFire(0, -50, 0);
        addFire(0, 1, 5, 100, 150, 100, 50);


    animateFire();
}
