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

var terrain = [];

var ducked = false;
var running = false;
var standupRequest = false;
var regenerate = false;
var speed_factor = 1;
var upMotion = 1;
var sideMotion = 1;

var PLAYERHEIGHT = 25;
var DUCK_SPEED = 0.6; // speed at which player is crouching
var DUCK_DIFFERENCE = 2 * (PLAYERHEIGHT / 3);
var RUN_SPEED = 2;
var INVERT_XZ = new THREE.Vector3(-1, 1, -1);
var MOVEMENT_SPEED = 600;

var JUMP_SPEED = 425;

var STAMINA = 100;

var energy = STAMINA;


var flashCooldown = 0;
var flashInterval;
var flashLight = new THREE.AmbientLight(0xFF0000);

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
$(".GUI").hide();

// maybe insert menu into following method

if (havePointerLock) {

    var element = document.getElementById('world');

    var pointerlockchange = function(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {


            //          controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';

        } else {
            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';
            menu = true;
            $(".GUI").hide();


        }

    };

    var pointerlockerror = function(event) {

        instructions.style.display = '';

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

        menu = false;
        $(".GUI").show();

        element.requestPointerLock();

    }, false);

    button.addEventListener('click', function(event) {

        startInstructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        menu = false;
        $(".GUI").show();

        element.requestPointerLock();

    }, false);

    button2.addEventListener('click', function(event) {

        location.reload();

    }, false);

} else {

    startInstructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

//CALL THIS IN YOUR INIT BLOCK
function initControls() {

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
                    adjustPlaybackRate(footsteps,1.5,true);
                    running = true;
                    speed_factor = RUN_SPEED;
                }

                break;


            case 67: // c to crouch

                if (!ducked && !running) {
                    ducked = true;
                    PLAYERHEIGHT -= DUCK_DIFFERENCE;
                    speed_factor = DUCK_SPEED;

                    // change far plane of collision rays (as they
                    // are now parallel to XZ plane)
                    raycasterXpos.far = 3;
                    raycasterXneg.far = 3;
                    raycasterZpos.far = 3;
                    raycasterZneg.far = 3;
                }

                break;

            case 80: //pause p
                if (!moveForward && !moveLeft && !moveRight && !moveBackward && !ducked && !jump) {
                    if (!menu) {
                        pause = !pause;
                    }
                    if (pause) {
                        controls.enabled = false;
                        $(".pauseBlocker").css("z-index", 15);
                        $(".GUI").hide();
                    } else {
                        controls.enabled = true;
                        $(".pauseBlocker").css("z-index", 0);
                        $(".GUI").show();
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


            case 16: // shift
                adjustPlaybackRate(footsteps,1, true);
                speed_factor = 1;
                running = false;
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

    raycasterY = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 20); // beneath


    raycasterYpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0, 20); // above

    raycasterXpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 32); // right

    raycasterZpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 32); // behind

    raycasterXneg = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 32); // left

    raycasterZneg = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 32); // front

    playerGround = new THREE.Vector3();

    rayDirectionXpos = new THREE.Vector3();
    rayDirectionXneg = new THREE.Vector3();
    rayDirectionZpos = new THREE.Vector3();
    rayDirectionZneg = new THREE.Vector3();

}


var firstTime = true;//we fall through the floor while spawning.. sick workaround

function controlLoop(controls) {

    setRays();


    // determines stepwidth
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // gravity
    velocity.y -= 9.8 * 170.0 * delta; // 100.0 = mass

    if (moveForward) velocity.z -= MOVEMENT_SPEED * speed_factor * delta;
    if (moveBackward) velocity.z += MOVEMENT_SPEED * speed_factor * delta;
    if (moveLeft) velocity.x -= MOVEMENT_SPEED * speed_factor * delta;
    if (moveRight) velocity.x += MOVEMENT_SPEED * speed_factor * delta;


    // determine intersections of rays with objects that were added to terrain
    var intersectionsY = raycasterY.intersectObjects(terrain);
    var intersectionsXpos = raycasterXpos.intersectObjects(terrain);
    var intersectionsZpos = raycasterZpos.intersectObjects(terrain);
    var intersectionsXneg = raycasterXneg.intersectObjects(terrain);
    var intersectionsZneg = raycasterZneg.intersectObjects(terrain);


    // forbid player to move farther if there are obstacles in the respective directions
    if (intersectionsY.length > 0) {
        //collision with fire!
        if (intersectionsY[0].object.type == TYPE_FIRE) {
            fireAction();
        } else if (intersectionsY[0].object.type == TYPE_TRIGGER) {
            //collision with trigger
            intersectionsY[0].object.interact();
            removeTrigger(intersectionsY[0].object);
        }
        //stop when hitting the floor
        velocity.y = Math.max(0, velocity.y);
        firstTime = false;

    }

    if (intersectionsZpos.length > 0) {
        if (intersectionsZpos[0].object.type == TYPE_FIRE) {
            fireAction();
        } else if (intersectionsZpos[0].object.type == TYPE_TRIGGER) {
            intersectionsZpos[0].object.interact();
            removeTrigger(intersectionsZpos[0].object);
        } else {
            velocity.z = Math.min(0, velocity.z);
        }
    }

    if (intersectionsZneg.length > 0) {
        if (intersectionsZneg[0].object.type == TYPE_FIRE) {
            fireAction();
        } else if (intersectionsZneg[0].object.type == TYPE_TRIGGER) {
            intersectionsZneg[0].object.interact();
            removeTrigger(intersectionsZneg[0].object);
        } else {
            velocity.z = Math.max(0, velocity.z);
        }
    }

    if (intersectionsXpos.length > 0) {
        if (intersectionsXpos[0].object.type == TYPE_FIRE) {
            fireAction();
        } else if (intersectionsXpos[0].object.type == TYPE_TRIGGER) {
            intersectionsXpos[0].object.interact();
            removeTrigger(intersectionsXpos[0].object);
        } else {
            velocity.x = Math.min(0, velocity.x);
        }
    }

    if (intersectionsXneg.length > 0) {
        if (intersectionsXneg[0].object.type == TYPE_FIRE) {
            fireAction();
        } else if (intersectionsXneg[0].object.type == TYPE_TRIGGER) {
            intersectionsXneg[0].object.interact();
            removeTrigger(intersectionsXneg[0].object);
        } else {
            velocity.x = Math.max(0, velocity.x);
        }
    }
    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);

    //RUNNING MOTION

    if((moveForward || moveBackward || moveRight || moveLeft)&&!ducked) {
        if (running) {

            //add positive value to y position while we are below threshold
            //change to negative when
            if(controls.getObject().position.y>39) upMotion = -1;
            if(controls.getObject().position.y<32) upMotion = 1;
            controls.getObject().position.y += upMotion*0.9;
            sideMotion+= 0.1;
            sideMotion= sideMotion%(2*Math.PI);
            controls.getObject().position.x += 0.4*Math.sin(sideMotion);

        } else {
            if (controls.getObject().position.y > 38) upMotion = -1;
            if (controls.getObject().position.y < 33) upMotion = 1;
            controls.getObject().position.y += upMotion * 0.35;
        }
    }

    // player can get exhausted/regenerate energy
    if (running) {
        energy -= delta * 30;
        if (energy <= 0) {
            regenerate = true;
            speed_factor = 1;
            running = false;
        }
    } else {
        energy += delta * 10;
        if (energy >= STAMINA) {
            energy = STAMINA;
            regenerate = false;
        }
    }
    $(".energy-bar").css("width", '' + energy + '%');


    // stop gravity at ground level as collision detection sometimes fails for floor
    if (controls.getObject().position.y < PLAYERHEIGHT && firstTime) {
        velocity.y = 0;
        controls.getObject().position.y = PLAYERHEIGHT + 5;
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
        scene.fog.color.set(0x424242);
        clearInterval(flashInterval);
        flashCooldown = -1;
    }

}




//if we are blocked upwards while ducking and try to stand up..
function handleStandup() {
    if (standupRequest) {
        var intersectionsYpos = raycasterYpos.intersectObjects(terrain);

        // stands up as soon as there are no more objects above
        if (intersectionsYpos.length == 0) {

            PLAYERHEIGHT += DUCK_DIFFERENCE;
            controls.getObject().position.y += 20;
            ducked = false;
            speed_factor = 1;
            raycasterXpos.far = 32;
            raycasterXneg.far = 32;
            raycasterZpos.far = 32;
            raycasterZneg.far = 32;
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
        playerX = controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI) / 2).normalize().multiplyScalar(10);
        playerZ = controls.getObject().getWorldDirection().normalize().multiplyScalar(10);
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
        player.damage(300);
        flashInterval = setInterval(function() {
            flashCooldown--;
        }, 1000);
    }
}
