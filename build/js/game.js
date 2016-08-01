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
    makeArrayFromXML(completedXmlLoad, newItemList);
}

// if XML-Parsing done
function completedXmlLoad(){
    // Load all files in Loader
    fileLoader= new FileLoader(completedFileLoad);// = new FileLoader();

    // Wait untill ready
    // starts init

}
function completedFileLoad () {
    init();
}

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container, controls, audioLoader, startInstructions, buttonStart,
    instructions, blocker, button;

var menu = true;
var pause = false;

//variable used for increasing fog  //TODO: wie schnell der fog kommt sollte raum/level-abhängig sein
var MAX_FOG = 0.015; if (godmode) {MAY_FOG = 0.005};
var myfog=0.002;
var fogTime=60; if (godmode) {fogTime = 1200};
var fogIncrement= MAX_FOG/(fogTime*1000/10) ;
var fogInterval;
var HEALTH_PER_SECOND = 10; if (godmode) {HEALTH_PER_SECOND = 0};// if fog is at final density you lose this much health


var octree;
var octreeObjects = [];
    //loads all Objects before creating



function init(event) {


	CreateSegment("circle_walled_robolab",scene);

    octree = new THREE.Octree( {
        // uncomment below to see the octree (may kill the fps)
        //scene: scene,
        // when undeferred = true, objects are inserted immediately
        // instead of being deferred until next octree.update() call
        // this may decrease performance as it forces a matrix update
        undeferred: false,
        // set the max depth of tree
        depthMax: Infinity,
        // max number of objects before nodes split or merge
        objectsThreshold: 8,
        // percent between 0 and 1 that nodes will overlap each other
        // helps insert objects that lie over more than one node
        overlapPct: 0.15
    } );

    // set up the scene, the camera and the renderer
    function scene (){
        createScene(audio);

        function audio (){
        // init audio support
            createAudio(room);

            function room() {

                createRoom(controls);
                function controls() {

                    // add the objects and lights - replace those functions as you please
                    initControls(startLoop);

                    function startLoop () {
                        // renderer.render(scene, camera);
    					// start a loop that will update the objects' positions
    					// and render the scene on each frame
    					loop();
                    }
                }
            }
        }
    }
}

// Stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Create the Scene
function createScene(complete) {

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
    var camPos = new THREE.Vector3(0, PLAYERHEIGHT + PLAYERHEIGHT * 0.4, 0);
    controls = new THREE.PointerLockControls(camera, camPos);
    scene.add(controls.getObject());

    // sky box
    // files are named by directions
    var sky_directions  = ["right", "left", "top", "bottom", "back", "front"];
    var sky_array = [];

    // make texture array
    for (var i = 0; i < 6; i++) {
        sky_array.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( "../avz_model/materials/textures/sky/sky_" + sky_directions[i] + ".jpg" ),
            side: THREE.BackSide,
        }));
    }

    var skyGeom = new THREE.BoxGeometry(2000,2000,2000);
    var skyMat = new THREE.MeshFaceMaterial( sky_array );
    var skyMesh = new THREE.Mesh(skyGeom,skyMat);
    scene.add(skyMesh);

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
    complete();
}


function loop() {
    console.log(octreeObjects);

    if (!menu && !pause) {
        if (player.health <= 0) {
            gameOverSound();
            gameOver();
        } else {

            stats.begin();
            requestAnimationFrame(loop);
            scene.fog.density = myfog;

            // YOU NEED TO CALL THIS (srycaps)
            controlLoop(controls);
            interactionLoop();

            renderer.render(scene, camera);
            octree.update();
            stats.end();
        }
    }
    // } else {
    //     requestAnimationFrame(loop);
    // }
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

    // // A hemisphere light is a gradient colored light;
    // // the first parameter is the sky color, the second parameter is the ground color,
    // // the third parameter is the intensity of the light
    // hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

    // // A directional light shines from a specific direction.
    // // It acts like the sun, that means that all the rays produced are parallel.
    // shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // // Set the direction of the light
    // shadowLight.position.set(50, 50, 50);

    // // Allow shadow casting
    // shadowLight.castShadow = true;

    // // define the visible area of the projected shadow
    // shadowLight.shadow.camera.left = -400;
    // shadowLight.shadow.camera.right = 400;
    // shadowLight.shadow.camera.top = 400;
    // shadowLight.shadow.camera.bottom = -400;
    // shadowLight.shadow.camera.near = 1;
    // shadowLight.shadow.camera.far = 1000;

    // // define the resolution of the shadow; the higher the better,
    // // but also the more expensive and less performant
    // shadowLight.shadow.mapSize.width = 2048;
    // shadowLight.shadow.mapSize.height = 2048;

    // // to activate the lights, just add them to the scene
    // scene.add(hemisphereLight);
    // scene.add(shadowLight);

}


function createRoom(callback) {

	PutSegments(doors);
    function doors () {
	    door_in_doors(objects);
        function objects() {
	        objects_in_spawns(fires);
            function fires() {
                set_fires(lights);
                function lights () {

                    for (var i = 0;i<terrain.length;i++) {
                        terrain[i].mesh == undefined ?  modifyOctree( terrain[i], true ) : modifyOctree( terrain[i].mesh, true );


                    }
	                turn_on_lights(callback);
                }
            }
        }
    }
}


//debug-stuff, deleteme
function ShowSegments() {
	var text = "";
	for (i = 0; i <segments.length; i++) {
		text += printmost(segments[i])+"<br>";  //JSON.stringify(segments[i])
	}
	alert(text);
}
function printmost(obj) {
	var output = '';
	for (var property in obj) {
	  if (property != 'mesh')
		{ output += property + ': ' + obj[property]+'; '; }
	}
	return output;
}
//debugstuffdeleteme ende

function createItems(callback){


     // // addItem(pathItem.concat(itemList[0]), 0, 5, 10, 2, true, pickUpItem);

	 // // addItem(file, xPos, yPos, zPos, scale, interact_type, intfunction, name)
	 // // TYPE_INTERACTABLE; TYPE_TRIGGER; TYPE_FIRE; TYPE_EXIT;
	 // // intfunction = damage_door, destroy_door, pickUpItem, destroy, open, openLockedDoor, extinguish

	 // //wände/terrain/statics, interactibles(auch feuer und türen), triggerevents(auch feuer), licher (auch feuer),

      // addItem((newItemList[0]), -50, 10, 10, 10, true, pickUpItem, newItemList[0]);
      // addItem((newItemList[1]), 20, 5, 10, 1, true, destroy, newItemList[1]);
      // addItem((newItemList[2]), 0, 5, 20, 3, true, pickUpItem, newItemList[2]);
      // addItem((newItemList[12]), 0, 5, -10, 3, true, pickUpItem, newItemList[12]);
   // // addItem(pathItem.concat(newItemList[4]), 30, 5, -30, 1, false, 0, itemList[4]);
  // //  addItem(pathItem.concat(newItemList[5]), 30, 5, -30, 1, true, openLockedDoor, itemList[5]);
   // // addItem(pathItem.concat(newItemList[6]), 30, 5, -100, 1, true, pickUpItem, itemList[6]);

     // for(var i =0; i< newItemList.length; i++){
        // console.log(newItemList[i]);
     // }


    // callback();

}
//debugstuffdeleteme ende


// Add Object with given Path to given coordinates
function addItemLogic(mesh, interact_type, intfunction, file){

	// alert("Ich habe eine Daseinsberechtigung");

    // if(interact_type){
        // var intItem = new GameObject(mesh, intfunction, TYPE_INTERACTABLE, file);
        // terrain.push(intItem);
    // } else {
        // terrain.push(mesh);
    // }


    // scene.add(mesh);

}

//adds a trigger at given position, performs action when walking over it and consumes it
// ***** TO FADE IN THOUGHTS: look up partial, showThoughts, hideThoughts in interact! ******

function addTrigger (xPos, zPos, action) {
    var triggerGeom = new THREE.BoxGeometry(30,30,30);
    var mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, color:0xFFFFFF});
    var triggerMesh = new THREE.Mesh(triggerGeom,mat);
    var trigger = new GameObject(triggerMesh,action,TYPE_TRIGGER);


    trigger.mesh.position.x = xPos;
    trigger.mesh.position.z = zPos;
    trigger.mesh.position.y = 0;
    scene.add(trigger.mesh);
    modifyOctree(trigger,true);

}

function removeTrigger(trigger) {
    scene.remove(trigger.mesh);
    for (var i =0;i < terrain.length;i++) {
        if(terrain[i]==trigger) {
            terrain.splice(i,1);
        }

    }
}



function modifyOctree( mesh , useFaces) {



        // create new object



        // give new object a random position, rotation, and scale

        if (mesh.mesh==undefined) {
            octree.add( mesh, { useFaces: useFaces } );
        } else {
            octree.add( mesh.mesh, { useFaces: useFaces } );
        }

        // add new object to octree and scene
        // NOTE: octree object insertion is deferred until after the next render cycle


        // scene.add( mesh );

        // store object

        octreeObjects.push( mesh );

        /*

        // octree details to console

        console.log( ' ============================================================================================================');
        console.log( ' OCTREE: ', octree );
        console.log( ' ... depth ', octree.depth, ' vs depth end?', octree.depthEnd() );
        console.log( ' ... num nodes: ', octree.nodeCountEnd() );
        console.log( ' ... total objects: ', octree.objectCountEnd(), ' vs tree objects length: ', octree.objects.length );
        console.log( ' ============================================================================================================');
        console.log( ' ');

        // print full octree structure to console

        octree.toConsole();

        */



}
