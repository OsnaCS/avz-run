var godmode = false; // zum testen, man kann nicht fallen, hat unendlich leben, unendlich sprinten, alle türen sind offen, Nebel kommt langsamer

var muteSounds = false; // if true, no sound will be played
var performantfire = true //when true, it makes the fires a bit worse and removes their pointlight
var nosmoothedges = false; //if true, it no edge will be smoothed.
var useLambertMaterial = false; //Meinungen gehen auseinander ob Lambert oder Phong performanter ist.
var onlygloballight = true;  //when true, no pointlights (specified in the rooms.xml) will be set.
var nofog = false;
var triggerstransparent = true;

document.getElementById("mutesounds").checked = muteSounds;
document.getElementById("performantfire").checked = performantfire;
document.getElementById("nosmoothing").checked = nosmoothedges;
document.getElementById("uselambert").checked = useLambertMaterial;
document.getElementById("useambient").checked = onlygloballight;



// Controls camera via WASD/Mouse, enables player to jump, run and crouch

// ---- NOTES FOR USAGE----

// IF YOU WANT COLLISION TO WORK, ADD YOUR OBJECTS TO "terrain" WHEN CREATING ENVIRONMENT
//      example: var meshX = new THREE.Mesh(geom, material);
//      terrain.push(meshX);

// create controls in createScene() with:
//      var camPos = new THREE.Vector3(0,PLAYERHEIGHT,0);
//      controls = new THREE.PointerLockControls(camera,camPos);
//      scene.add(controls.getObject());

// CAMERA needs to be at 0,0,0 - change PLAYERHEIGHT if needed

// call initControls() in init()
// call controlLoop(controls) in loop()


var clock, playerGround, playerPos, playerX,
    playerXpos, playerXneg, playerZpos, playerZneg;

// directions of rays used for collision detection
var rayDirectionXpos, rayDirectionXneg, rayDirectionZpos, rayDirectionZneg;

var controlsEnabled = false;

// save requests for movements into the respective directions
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var canJump = false;

var prevTime = performance.now();

var velocity = new THREE.Vector3();


var ducked = false;
var running = false;
var standupRequest = false;
var regenerate = false;
var speed_factor = 1;
var upMotion = 1;
var sideMotion = 1;

// THIS ONE CHANGES EVERYTHING:
var PLAYERHEIGHT = 25;

var PLAYERMASS = PLAYERHEIGHT * 6.8; // to simulate gravity

var DUCK_DIFFERENCE = 19 * (PLAYERHEIGHT / 20); // player height when ducked

var INVERT_XZ = new THREE.Vector3(-1, 1, -1);

var MOVEMENT_SPEED = PLAYERHEIGHT * 24;
var DUCK_SPEED = 0.6; // speed at which player is crouching in relation to MOVEMENT_SPEED
var RUN_SPEED = 2; // speed at which player is running -"-
var JUMP_SPEED = MOVEMENT_SPEED * 0.7; // speed of jump upwards -"-

// for shake animation while moving
var THRESH_RUN_UP = PLAYERHEIGHT * 1.52;
var THRESH_RUN_DOWN = PLAYERHEIGHT * 1.32;
var THRESH_UP = PLAYERHEIGHT * 1.48;
var THRESH_DOWN = PLAYERHEIGHT * 1.36;
var UPMOTION_RUN_SPEED = (THRESH_RUN_UP - THRESH_RUN_DOWN) * 0.13;
var UPMOTION_SPEED = (THRESH_UP - THRESH_DOWN) * 0.08;

// for energy bar
var STAMINA = 100; if (godmode) {STAMINA = 1000000}
var energy = STAMINA;

var flashCooldown = 0;
var flashInterval;
var flashLight = new THREE.AmbientLight(0xFF0000);

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

function initPointerLock() {
    $(".gui").hide();

    // maybe insert menu into following method

    if (havePointerLock) {

        var element = document.getElementById('world');

        var pointerlockchange = function(event) {

            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

                controls.enabled = true;

                $(".gui").show();
                $("#blocker").hide();

            } else if (special_html_input) {

                scene.remove(outlineMesh);
                outlineMesh = null;
                activeObject = null;
                controls.enabled = false;

            } else {
                controls.enabled = false;

                if (player.health > 0) {
                   $("#blocker").show();
                }

                menu = true;
                $('.gui').hide();
            }


        };

        var pointerlockerror = function(event) {

            $("#blocker").hide();

        };

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);


        buttonStart.addEventListener('click', function(event) {

            startInstructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
            menu = false;

            $(".gui").show();

            playername = $("#nickname").val();
            $(".showNickname").html(playername);
            loop();

        }, false);

        buttonInfo.addEventListener('click', function(event) {
            mainMenu.style.display = 'none';
            infoScreen.style.display = 'block';
        }, false);

        buttonInfoBack.addEventListener('click', function(event) {
            infoScreen.style.display = 'none';
            mainMenu.style.display = 'block';
        }, false);
        buttonSettings.addEventListener('click', function(event) {
            mainMenu.style.display = 'none';
            settingswindow.style.display = 'block';
        }, false);
        buttonSettingsBack.addEventListener('click', function(event) {
            settingswindow.style.display = 'none';
            mainMenu.style.display = 'block';
        }, false);


        button.addEventListener('click', function(event) {

            startInstructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            menu = false;

            $(".gui").show();
            prevTime = performance.now();

            element.requestPointerLock();
            loop();
        }, false);

        button2.addEventListener('click', function(event) {

            location.reload();

        }, false);

        buttonRestart.addEventListener('click', function(event) {
            location.reload();

        }, false);


    } else {

        startInstructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
}
//CALL THIS IN YOUR INIT BLOCK
function initControls(callback) {
    initPointerLock();
    var onKeyDown = function(event) {

        switch (event.keyCode) {

            //inventory slot 1
            case 49:
                setActiveSlot(0);
                break;
                //inventory slot 2
            case 50:
                setActiveSlot(1);
                break;
                //inventory slot 3
            case 51:
                setActiveSlot(2);
                break;
            case 38: // up
            case 87: // w
                moveForward = true;
                startFootsteps();
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                startFootsteps();
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                startFootsteps();
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                startFootsteps();
                break;

            case 32: // space
                if (canJump === true && !ducked) {
                    velocity.y += JUMP_SPEED;
                    canJump = false;
                    stopFootsteps();
                }
                break;



            case 16: //RUN FOREST! (shift)

                if (!ducked && !regenerate) {
                    if (running == false) {
                        adjustPlaybackRate(footsteps, 1.5);
                        running = true;
                    }
                    speed_factor = RUN_SPEED;
                }

                break;


            case 67: // c to crouch

                if (!ducked && !running) {
                    ducked = true;

                    speed_factor = DUCK_SPEED;

                    // change far plane of collision rays (as they
                    // are now parallel to XZ plane)
                    raycasterXpos.far = PLAYERHEIGHT * 0.5;
                    raycasterXneg.far = PLAYERHEIGHT * 0.5;
                    raycasterZpos.far = PLAYERHEIGHT * 0.5;
                    raycasterZneg.far = PLAYERHEIGHT * 0.5;
                    PLAYERHEIGHT -= DUCK_DIFFERENCE;
                }

                break;


            case 80: //pause p
                if (!moveForward && !moveLeft && !moveRight && !moveBackward && !ducked) {

                    if (!menu) {
                        pause = !pause;
                    }
                    if (pause) {
                        controls.enabled = false;
                        $("#blocker").show();
                        $(".gui").hide();
                    } else {
                        controls.enabled = true;
                        $("#blocker").hide();
                        $(".gui").show();
                    }
                }
                break;

            case 73: // i to show inventory  (maybe also to toggle later?)
                player.showInv();
                break;

        }

    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                stopFootsteps();
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                stopFootsteps();
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                stopFootsteps();
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                stopFootsteps();
                break;


            case 16: //
                if (running == true) {
                    adjustPlaybackRate(footsteps, 1, true);
                    speed_factor = 1;
                    running = false;
                }
                break;

            case 67: // c

                // player might be unable to stand up, so this will
                // be handled later
                if (ducked) {
                    standupRequest = true;
                }
                break;


        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // create rays for collision detection in each direction(direction values will be changed later)

    raycasterY = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, PLAYERHEIGHT * 0.8); // beneath


    raycasterYpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0, PLAYERHEIGHT * 0.8); // above

    raycasterXpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900) ); // right PLAYERHEIGHT * 1.28

    raycasterZpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900)); // behind

    raycasterXneg = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900)); // left

    raycasterZneg = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900)); // front



    playerGround = new THREE.Vector3();

    rayDirectionXpos = new THREE.Vector3();
    rayDirectionXneg = new THREE.Vector3();
    rayDirectionZpos = new THREE.Vector3();
    rayDirectionZneg = new THREE.Vector3();

    callback();
}

var intersectionsY = null;
var intersectionsYpos = null;
var intersectionsXpos = null;
var intersectionsZpos = null;
var intersectionsXneg = null;
var intersectionsZneg = null;

var gameObj;

var firstTime = true; //we fall through the floor while spawning.. sick workaround

var moveX;
var moveY;
var moveZ;

function controlLoop(controls) {

    setRays();

    // determines stepwidth
    time = performance.now();
    delta = (time - prevTime) / 1000;
    if(delta>0.24) delta=0.1;
    if(Math.abs(velocity.z)<Math.abs(velocity.z * 10.0 * delta)) {
        velocity.z=0;
    } else {
        velocity.z -= velocity.z * 10.0 * delta;
    }
    if(Math.abs(velocity.x)<Math.abs(velocity.x * 10.0 * delta)) {
        velocity.x=0;
    } else {
        velocity.x -= velocity.x * 10.0 * delta;
    }
    // velocity.x=0;
    // velocity.z=0;

    // gravity
    velocity.y -= 9.8 * PLAYERMASS * delta;

    if (moveForward) velocity.z -= MOVEMENT_SPEED * speed_factor * delta;
    if (moveBackward) velocity.z += MOVEMENT_SPEED * speed_factor * delta;
    if (moveLeft) velocity.x -= MOVEMENT_SPEED * speed_factor * delta;
    if (moveRight) velocity.x += MOVEMENT_SPEED * speed_factor * delta;



    octreeObjectsY = octree.search( raycasterY.ray.origin, raycasterY.far, true, raycasterY.ray.direction );
    intersectionsY = raycasterY.intersectOctreeObjects( octreeObjectsY);

    octreeObjectsXpos = octree.search( raycasterXpos.ray.origin, raycasterXpos.far, true, raycasterXpos.ray.direction );
    intersectionsXpos = raycasterXpos.intersectOctreeObjects( octreeObjectsXpos );

    octreeObjectsZpos = octree.search( raycasterZpos.ray.origin, raycasterZpos.far, true, raycasterZpos.ray.direction );
    intersectionsZpos = raycasterZpos.intersectOctreeObjects( octreeObjectsZpos );

    octreeObjectsXneg = octree.search( raycasterXneg.ray.origin, raycasterXneg.far, true, raycasterXneg.ray.direction );
    intersectionsXneg = raycasterXneg.intersectOctreeObjects( octreeObjectsXneg );

    octreeObjectsZneg = octree.search( raycasterZneg.ray.origin, raycasterZneg.far, true, raycasterZneg.ray.direction );
    intersectionsZneg = raycasterZneg.intersectOctreeObjects( octreeObjectsZneg );


    // //determine intersections of rays with objects that were added to terrain
    // intersectionsY = raycasterY.intersectObjects(terrain);
    // intersectionsXpos = raycasterXpos.intersectObjects(terrain);
    // intersectionsZpos = raycasterZpos.intersectObjects(terrain);
    // intersectionsXneg = raycasterXneg.intersectObjects(terrain);
    // intersectionsZneg = raycasterZneg.intersectObjects(terrain);


    // // forbid player to move farther if there are obstacles in the respective directions
    if (intersectionsY.length > 0) {
        gameObj = getGameObject(intersectionsY[0].object);
        //collision with fire!
        if (gameObj.type == TYPE_FIRE) {
            fireAction();

        } else if (gameObj.type == TYPE_TRIGGER) {
            //collision with trigger
            gameObj.interact();
            disableTrigger(gameObj);
        } else {
            //stop when hitting the floor
            velocity.y = Math.max(0, velocity.y);
            firstTime = false;
        }
    }

    if (intersectionsZpos.length > 0) {
        // console.log(intersectionsZpos[0].object);
        gameObj = getGameObject(intersectionsZpos[0].object);

        if (gameObj.type == TYPE_FIRE) {
            fireAction();
        } else if (gameObj.type == TYPE_TRIGGER) {
            gameObj.interact();
            disableTrigger(gameObj);
        } else {
            velocity.z = Math.min(0, velocity.z);
        }
    }

    if (intersectionsZneg.length > 0) {
        gameObj = getGameObject(intersectionsZneg[0].object);
        if (gameObj.type == TYPE_FIRE) {
            fireAction();
        } else if (gameObj.type == TYPE_TRIGGER) {
            gameObj.interact();
            disableTrigger(gameObj);
        } else {
            velocity.z = Math.max(0, velocity.z);
        }
    }

    if (intersectionsXpos.length > 0) {
        gameObj = getGameObject(intersectionsXpos[0].object);
        if (gameObj.type == TYPE_FIRE) {
            fireAction();
        } else if (gameObj.type == TYPE_TRIGGER) {
            gameObj.interact();
            disableTrigger(gameObj);
        } else {
            velocity.x = Math.min(0, velocity.x);
        }
    }

    if (intersectionsXneg.length > 0) {
        gameObj = getGameObject(intersectionsXneg[0].object);
        if (gameObj.type == TYPE_FIRE) {
            fireAction();
        } else if (gameObj.type == TYPE_TRIGGER) {
            gameObj.interact();
            disableTrigger(gameObj);
        } else {
            velocity.x = Math.max(0, velocity.x);
        }
    }
    velocity.x = Math.abs(velocity.x * delta) >30 ? Math.sign(velocity.x)*29 : velocity.x ;
    if(velocity.y<0) velocity.y = Math.abs(velocity.y * delta) >raycasterY.far ? -1*(raycasterY.far-1) : velocity.y;
    velocity.z = Math.abs(velocity.z * delta) > 30 ? Math.sign(velocity.z)*29: velocity.z ;

    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);

    //RUNNING MOTION

    if ((moveForward || moveBackward || moveRight || moveLeft) && !ducked) {
        if (running) {

            //add positive value to y position while we are below threshold
            //change to negative when
            if (controls.getObject().position.y > THRESH_RUN_UP) upMotion = -1;
            if (controls.getObject().position.y < THRESH_RUN_DOWN) upMotion = 1;
            controls.getObject().position.y += upMotion * UPMOTION_RUN_SPEED;
            sideMotion += 0.1;
            sideMotion = sideMotion % (2 * Math.PI);
            controls.getObject().position.x += 0.4 * Math.sin(sideMotion);

        } else {
            if (controls.getObject().position.y > THRESH_UP) upMotion = -1;
            if (controls.getObject().position.y < THRESH_DOWN) upMotion = 1;
            controls.getObject().position.y += upMotion * UPMOTION_SPEED;
        }
    }

    // stop gravity at ground level as collision detection sometimes fails for floor
    if ((firstTime || godmode) && controls.getObject().position.y < PLAYERHEIGHT) {
        velocity.y = 0;
        controls.getObject().position.y = PLAYERHEIGHT + PLAYERHEIGHT * 0.2;
    }

    if (controls.getObject().position.y < -500) {
        player.damage(10000);
    }

    // checks if we can stand up (may be forbidden when crouching beneath an object)
    handleStandup();

    if (velocity.y == 0) {
        canJump = true;
        if (moveForward || moveBackward || moveRight || moveLeft) {
            startFootsteps();
        }
    }

    prevTime = time;

    if (flashCooldown == 0) {
        scene.remove(flashLight);

        if(!nofog) scene.fog.color.set(0x424242);
        clearInterval(flashInterval);
        flashCooldown = -1;
    }

}



//if we are blocked upwards while ducking and try to stand up..
function handleStandup() {
    if (standupRequest) {
        octreeObjectsYpos = octree.search( raycasterYpos.ray.origin, raycasterYpos.far, true, raycasterYpos.ray.direction );
        intersectionsYpos = raycasterYpos.intersectOctreeObjects( octreeObjectsYpos );

        // stands up as soon as there are no more objects above
        if (intersectionsYpos.length == 0) {

            PLAYERHEIGHT += DUCK_DIFFERENCE;
            controls.getObject().position.y += DUCK_DIFFERENCE;
            ducked = false;
            speed_factor = 1;
            raycasterXpos.far = Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900);
            raycasterXneg.far = Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900);
            raycasterZpos.far = Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900);
            raycasterZneg.far = Math.sqrt(PLAYERHEIGHT*PLAYERHEIGHT+900);
            standupRequest = false;
        }

    }

}

function setRays() {
    // position of player's head
    playerPos = new THREE.Vector3();
    playerPos.copy(controls.getObject().position);

    // position of player's feet
    playerGround.subVectors(playerPos, new THREE.Vector3(0, PLAYERHEIGHT, 0));

    // the collision rays are sloped upwards from player's feet
    if (!ducked) {

        // x and z axis transformed according to player's rotation
        playerX = controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI) / 2).normalize().multiplyScalar(30);
        playerZ = controls.getObject().getWorldDirection().normalize().multiplyScalar(30);
        // mirror the X and Y vectors for opposing directions
        playerXneg = new THREE.Vector3();
        playerZneg = new THREE.Vector3();
        playerXneg.multiplyVectors(playerX, INVERT_XZ);
        playerZneg.multiplyVectors(playerZ, INVERT_XZ);

        // we obtain the ray vectors by adding the player's viewdirection-vector to the position.
        // then we substract the ground point from the resulting vector and we're done

        rayDirectionXpos.subVectors(new THREE.Vector3().addVectors(playerPos, playerX), playerGround).normalize();
        rayDirectionXneg.subVectors(new THREE.Vector3().addVectors(playerPos, playerXneg), playerGround).normalize();
        rayDirectionZpos.subVectors(new THREE.Vector3().addVectors(playerPos, playerZ), playerGround).normalize();
        rayDirectionZneg.subVectors(new THREE.Vector3().addVectors(playerPos, playerZneg), playerGround).normalize();

        raycasterY.ray.origin.copy(playerGround);
        raycasterXpos.set(playerGround, rayDirectionXpos);
        raycasterXneg.set(playerGround, rayDirectionXneg);
        raycasterZpos.set(playerGround, rayDirectionZpos);
        raycasterZneg.set(playerGround, rayDirectionZneg);

    } else {
        //if we are ducked we shoot the rays straight ahead
        raycasterYpos.ray.origin.copy(controls.getObject().position);
        raycasterY.ray.origin.copy(playerGround);
        raycasterXpos.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI) / 2).normalize());
        raycasterXneg.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0, 1, 0), -(Math.PI) / 2).normalize());
        raycasterZpos.set(controls.getObject().position, controls.getObject().getWorldDirection().normalize());
        raycasterZneg.set(controls.getObject().position, controls.getObject().getWorldDirection().negate().normalize());


    }

}

//take damage and flash screen when colliding with fire
function fireAction() {
    if (flashCooldown == -1) {
        scene.add(flashLight);
        scene.fog.color.set(0xff0000);;
        flashCooldown = 1;
        player.damage(MAX_HEALTH/6);
        painSound();
        flashInterval = setInterval(function() {
            flashCooldown--;
        }, 1000);
    }
}
