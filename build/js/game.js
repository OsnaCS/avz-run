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

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, buttonInfoBack, buttonSettingsBack,
    renderer, container, controls, audioLoader, startInstructions, buttonStart, infoScreen, buttonStart, buttonInfo, buttonSettings,
    mainMenu, instructions, blocker, button;


var MAX_FOG, myfog, fogTime, fogIncrement, fogInterval, HEALTH_PER_SECOND;

var menu = true;
var pause = false;

//variables used for increasing fog are now to find after the creation of the scene

var player;
var octree;
var octreeObjects = [];
var clock;

//loads all Objects before creating
function init(event) {

    clock = new THREE.Clock();

    octree = new THREE.Octree( {
        // uncomment below to see the octree (may kill the fps)
        //scene: scene,
        // when undeferred = true, objects are inserted immediately
        // instead of being deferred until next octree.update() call
        // this may decrease performance as it forces a matrix update
        undeferred: false,
        // set the max depth of tree
        depthMax: 20,
        // max number of objects before nodes split or merge
        objectsThreshold: 8,
        // percent between 0 and 1 that nodes will overlap each other
        // helps insert objects that lie over more than one node
        overlapPct: 0.15
    } );


// set up the scene, the camera and the renderer

	createScene(audio);

	function audio (){
    // init audio support
        createAudio(room);

        function room() {

                createRoom(controlls);
                function controlls() {


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

// Stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Create the Scene
function createScene(complete) {

    blocker = document.getElementById('blocker');
    container = document.getElementById('world');
    startInstructions = document.getElementById('startInstructions');
    mainMenu = document.getElementById('mainMenu');
    infoScreen = document.getElementById('infoScreen');
    buttonStart = document.getElementById('buttonStart');
    buttonInfo = document.getElementById('buttonInfo');
    buttonInfoBack = document.getElementById('buttonInfoBack');
	buttonSettings = document.getElementById('buttonSettings');
	buttonSettingsBack = document.getElementById('buttonSettingsBack');
	settingswindow = document.getElementById('settingswindow');
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

    fogInterval = setInterval(function() {
    	if (!menu && !pause) {
    		player.damage(myfog / MAX_FOG) * (HEALTH_PER_SECOND / 100);
			player.damage(additional_healthloose);
			
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

    sky_loader = new THREE.TextureLoader();
    // make texture array
    for (var i = 0; i < 6; i++) {
    	sky_array.push( new THREE.MeshBasicMaterial({
    		map: sky_loader.load( "../avz_model/materials/textures/sky/sky_" + sky_directions[i] + ".jpg" ),
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

    if (!nofog) scene.fog = new THREE.FogExp2(0x424242, 0.005);
    complete();
}


function loop() {


    if (!menu && !pause) {
    	if (player.health <= 0) {
    		gameOverSound();
    		gameOver();
    	} else {

            // determines stepwidth
            time = performance.now();
            delta = (time - prevTime) / 1000;

            stats.begin();

            //setTimeout( function() {
            //     requestAnimationFrame( loop );
            // }, 1000 / 10 );
            requestAnimationFrame(loop);

            if (!nofog) scene.fog.density = myfog;
            player.updateEnergy();

            // YOU NEED TO CALL THIS (srycaps)
            if (!special_html_input) {
            	controlLoop(controls);
            	interactionLoop();
            }

            move();

            renderer.render(scene, camera);
            octree.update();
            stats.end();
        }
    }
}



    function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


var roboternum = 0;
var robolab = false;
var roboPosX;
var roboPosY;
var roboPosZ;

function move(){
    if(roboternum == 0){
        for (i = 0; i < static_obj.length; i++) {
            if(static_obj[i].name == "evil_roboter"){
                roboternum = i;
                roboPosX = static_obj[roboternum].msh.position.x;
                roboPosY = static_obj[roboternum].msh.position.y;
                roboPosZ = static_obj[roboternum].msh.position.z;
                robolab = true;
                break;
            }

        }

        if(!robolab){
            roboternum = 1;
        }

    }

    if(robolab){
        var deltaTime = clock.getDelta();

        moveObject(static_obj[roboternum].msh , roboPosX, roboPosY, roboPosZ, 0*SKALIERUNGSFAKTOR, 0*SKALIERUNGSFAKTOR, 9*SKALIERUNGSFAKTOR, 1000, deltaTime);
            
    }
}

function createRoom(callback) {
	$("#loadingBlocker2").show();
	$(".gui").hide();
	readLevelsXML(csegments);
	function csegments() {
        createAllSegments(psegments);
        function psegments () {
    		PutSegments(doors);
			
			
    		function doors () {
    			door_in_doors(objects);
    			function objects() {
    				objects_in_spawns(fires);
    				function fires() {
						if (!nofog) {
							console.log("Max-Fog auf diesem Level: "+thisfloor.maxfog)
							MAX_FOG = thisfloor.maxfog; if (godmode) {MAX_FOG = 0.005};
							myfog = thisfloor.startfog; if (godmode) {myfog = 0.0002}; 
							fogTime = thisfloor.fogtime; if (godmode) {fogTime = 1200};  //siehe oben

							fogIncrement= MAX_FOG/(fogTime*1000/10) ;
							
							scene.fog = new THREE.FogExp2(0x424242, 0.00002 + myfog);
						}
						HEALTH_PER_SECOND = 10; if (godmode) {HEALTH_PER_SECOND = 0};// if fog is at final density you lose this much health			
						controls.getObject().position.x = parseFloat(thisfloor.spawn.slice(1,thisfloor.spawn.indexOf(',')))*SKALIERUNGSFAKTOR;
						controls.getObject().position.y = parseFloat(thisfloor.spawn.slice(thisfloor.spawn.indexOf(',')+1,thisfloor.spawn.lastIndexOf(',')))*SKALIERUNGSFAKTOR;
						controls.getObject().position.z = parseFloat(thisfloor.spawn.slice(thisfloor.spawn.lastIndexOf(',')+1,thisfloor.spawn.indexOf(')')))*SKALIERUNGSFAKTOR;
    					set_fires(lights);
    					function lights () {
    						turn_on_lights(triggers);
    						var gesamtlicht = 0;
							var tmplight;
    						if (thisfloor.ambientintens > 0) {
                                tmplight = new THREE.AmbientLight(parseInt(thisfloor.ambientcolor),parseInt(thisfloor.ambientintens))
    							addtoscene(tmplight); threelights.push(tmplight);
    							gesamtlicht += parseInt(thisfloor.ambientintens);
    						}
    						if (godmode) {
								tmplight = new THREE.AmbientLight(0xFFFFFF,(1-gesamtlicht));
    							addtoscene(tmplight); threelights.push(tmplight);
    							gesamtlicht += (1-gesamtlicht);
    						}
    						if (gesamtlicht < 0.3 && onlygloballight) {
								tmplight = new THREE.AmbientLight(0xFFBFBF,(0.3-gesamtlicht));
    							addtoscene(tmplight); threelights.push(tmplight);
    						}
    						function triggers () {
    							addtriggers(levelSettings);
                                function levelSettings () {
									$("#loadingBlocker2").hide();
									$(".gui").show();
                                    callback();
                                }
    						}
                        }
    				}
    			}
    		}
        }
	}
}

function resetScene(callback) {
    scene = null;
    scene= new THREE.Scene();
	

	
    // var camPos = new THREE.Vector3(0, PLAYERHEIGHT + PLAYERHEIGHT * 0.4, 0);
	// controls = null;
    // controls = new THREE.PointerLockControls(camera, camPos);
    // scene.add(controls.getObject());

    // sky box
    // files are named by directions
    var sky_directions  = ["right", "left", "top", "bottom", "back", "front"];
    var sky_array = [];

    sky_loader = new THREE.TextureLoader();
    // make texture array
    for (var i = 0; i < 6; i++) {
        sky_array.push( new THREE.MeshBasicMaterial({
            map: sky_loader.load( "../avz_model/materials/textures/sky/sky_" + sky_directions[i] + ".jpg" ),
            side: THREE.BackSide,
        }));
    }
    var skyGeom = new THREE.BoxGeometry(2000,2000,2000);
    var skyMat = new THREE.MeshFaceMaterial( sky_array );
    var skyMesh = new THREE.Mesh(skyGeom,skyMat);
    addtoscene(skyMesh);
	callback();
		
}


function recreateRoom() {
	//lösche erst alle segments, doors, objects, fires, lights, triggers. Dann calle createRoom/init
	
    empty_scene(reset);
	
	function reset() {
		
		resetScene(octrem);
		function octrem () {
			octree = null;
			octree = new THREE.Octree( {
				// uncomment below to see the octree (may kill the fps)
				//scene: scene,
				// when undeferred = true, objects are inserted immediately
				// instead of being deferred until next octree.update() call
				// this may decrease performance as it forces a matrix update
				undeferred: false,
				// set the max depth of tree
				depthMax: 20,
				// max number of objects before nodes split or merge
				objectsThreshold: 8,
				// percent between 0 and 1 that nodes will overlap each other
				// helps insert objects that lie over more than one node
				overlapPct: 0.15
			} );
			console.log("Recreating everything...");
			function cont (){pause = false;
				requestAnimationFrame(loop);
			}	
			// cont();			
			createRoom(cont);
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



//adds a trigger at given position, performs action when walking over it and consumes it
// ***** TO FADE IN THOUGHTS: look up partial, showThoughts, hideThoughts in interact! ******
function addTrigger (activated, xPos, zPos, size, action, fname, fparam1, fparam2, enabledtrigger, index, nonewentry) {

	var hohe = (size > PLAYERHEIGHT*3) ? size: PLAYERHEIGHT*3;
    var triggerGeom = new THREE.BoxGeometry(size,hohe,size);
    var mat = new THREE.MeshBasicMaterial({ transparent: false, opacity: 0, depthWrite: false, color:0xFFFFFF});
    var triggerMesh = new THREE.Mesh(triggerGeom,mat);
    var trigger = new GameObject(triggerMesh,action,TYPE_TRIGGER);


	var thisone;
	if (!nonewentry) {
		thisone = {ind: index, obj: trigger, xpos: xPos, zpos: zPos, siz: size, fname: fname, fparam1: fparam1, fparam2: fparam2, followup: enabledtrigger, enabled: activated};
		triggers.push(thisone);
	} else {
		for (var i = 0; i < triggers.length; i++) {
			if (triggers[i].ind === index) {
				triggers[i].obj = trigger;
				thisone = triggers[i];
			}
		}
	}

	if (activated) {
		trigger.mesh.position.x = thisone.xpos;
		trigger.mesh.position.z = thisone.zpos;
		trigger.mesh.position.y = 0;
		addtoscene(trigger.mesh);
		modifyOctree(trigger,true);
	}
}


function disableTrigger(trigger) {
	for (var i = 0; i < triggers.length; i++) {
		if (triggers[i].obj === trigger) {
			triggers[i].enabled = false;
			console.log(triggers[i].fname+"-trigger disabled");
			for (var j = 0; j < triggers.length; j++) {
				if (triggers[j].ind === triggers[i].followup) {
					enableTrigger(triggers[j].ind);
					break;
				}
			}
		}
	}
    scene.remove(trigger.mesh);
    octree.remove(trigger.mesh);
}

function enableTrigger(index) {
	for (var i = 0; i < triggers.length; i++) {
		if (triggers[i].ind === index) {
			triggers[i].enabled = true;
			var functPtr = eval(triggers[i].fname);

			if (triggers[i].fparam1 === "") addTrigger(true, triggers[i].xpos, triggers[i].zpos, triggers[i].siz, functPtr, triggers[i].fname, "", "", triggers[i].followup, triggers[i].ind, true)
				else if (triggers[i].fparam2 === "") addTrigger(true, triggers[i].xpos, triggers[i].zpos, triggers[i].siz, partial(functPtr, triggers[i].fparam1), triggers[i].fname, triggers[i].fparam1, "", triggers[i].followup, triggers[i].ind, true)
					else addTrigger(true, triggers[i].xpos, triggers[i].zpos, triggers[i].siz, partial(functPtr, triggers[i].fparam1, triggers[i].fparam2), triggers[i].fname, triggers[i].fparam1, triggers[i].fparam2, triggers[i].followup, triggers[i].ind, true)

			console.log(triggers[i].fname+"-trigger enabled");
		}
	}
}





function modifyOctree( mesh , useFaces) {
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
