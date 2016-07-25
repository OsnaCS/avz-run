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

var blocker = document.getElementById('world');
var instructions = document.getElementById('world');


var terrain = [];

var ducked = false;
var running = false;
var standupRequest = false;
var speed_factor=1;


var PLAYERHEIGHT = 25;
var DUCK_SPEED = 0.6; // speed at which player is crouching
var DUCK_DIFFERENCE = 2*(PLAYERHEIGHT/3);
var RUN_SPEED = 2;
var INVERT_XZ = new THREE.Vector3(-1,1,-1);
var MOVEMENT_SPEED = 600;
var JUMP_SPEED = 500;

var flashCooldown = 0;
var flashInterval;
var flashLight = new THREE.AmbientLight(0xFF0000);

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


// maybe insert menu into following method

if (havePointerLock) {

    var element = document.getElementById('world');

    var pointerlockchange = function (event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {


//          controlsEnabled = true;
            controls.enabled = true;

            //blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    };

    var pointerlockerror = function (event) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function (event) {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();


    }, false);

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}




//CALL THIS IN YOUR INIT BLOCK
function initControls() {

    var onKeyDown = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true &&!ducked) velocity.y += JUMP_SPEED;
                canJump = false;
                break;


            case 16: //RUN FOREST! (shift)

                if (!ducked) {
                    running=true;
                    speed_factor=RUN_SPEED;
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

            case 73: // i to show inventory  (maybe also to toggle later?)
                player.showInv();
                break;

        }

    };

    var onKeyUp = function (event) {

        switch(event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;


            case 16: // shift

                speed_factor = 1;
                running = false;
                break;

            case 67: // c

                // player might be unable to stand up, so this will
                // be handled later
                if (ducked) {
                    standupRequest=true;
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


var firstTime=true;
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
        if (moveRight) velocity.x += MOVEMENT_SPEED  * speed_factor * delta;


        // determine intersections of rays with objects that were added to terrain
        var intersectionsY = raycasterY.intersectObjects(terrain);
        var intersectionsXpos = raycasterXpos.intersectObjects(terrain);
        var intersectionsZpos = raycasterZpos.intersectObjects(terrain);
        var intersectionsXneg = raycasterXneg.intersectObjects(terrain);
        var intersectionsZneg = raycasterZneg.intersectObjects(terrain);


        // forbid player to move farther if there are obstacles in the respective directions
        if (intersectionsY.length > 0) {
            if(intersectionsY[0].object.type == TYPE_FIRE) {
                fireAction();
            }
            velocity.y = Math.max(0, velocity.y);
            firstTime=false;
        }

        if(intersectionsZpos.length > 0) {
            if(intersectionsZpos[0].object.type == TYPE_FIRE) {
                fireAction();
            }
            velocity.z = Math.min(0, velocity.z);
        }

        if(intersectionsZneg.length > 0) {
            if(intersectionsZneg[0].object.type == TYPE_FIRE) {
                fireAction();
            }
            velocity.z = Math.max(0, velocity.z);
        }

        if(intersectionsXpos.length > 0) {
            if(intersectionsXpos[0].object.type == TYPE_FIRE) {
                fireAction();
            }
            velocity.x = Math.min(0, velocity.x);
        }

        if(intersectionsXneg.length > 0) {
            if(intersectionsXneg[0].object.type == TYPE_FIRE) {
                fireAction();
            }
            velocity.x = Math.max(0, velocity.x);
        }
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);



        // stop gravity at ground level as collision detection sometimes fails for floor
        if (controls.getObject().position.y < PLAYERHEIGHT&&firstTime) {
            velocity.y = 0;
            controls.getObject().position.y = PLAYERHEIGHT+5;
        }

        // checks if we can stand up (may be forbidden when crouching beneath an object)
        handleStandup();

        if(velocity.y == 0) {
            canJump = true;
        }

        prevTime = time;

        if(flashCooldown==0) {
            scene.remove(flashLight);
            scene.fog.color.set(0x424242 );
            clearInterval(flashInterval);
            flashCooldown=-1;
        }

}



function handleStandup() {
        if(standupRequest) {
            var intersectionsYpos = raycasterYpos.intersectObjects(terrain);

            // stands up as soon as there are no more objects above
            if(intersectionsYpos.length == 0) {

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
        playerPos =  new THREE.Vector3();
        playerPos.copy(controls.getObject().position);

        // position of player's feet
        playerGround.subVectors(playerPos,new THREE.Vector3(0,PLAYERHEIGHT,0));

        // the collision rays are sloped upwards from player's feet
        if(!ducked) {

            // x and z axis transformed according to player's rotation
            playerX = controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.PI)/2).normalize().multiplyScalar(10);
            playerZ = controls.getObject().getWorldDirection().normalize().multiplyScalar(10);
            // mirror the X and Y vectors for opposing directions
            playerXneg =new THREE.Vector3();
            playerZneg = new THREE.Vector3();
            playerXneg.multiplyVectors(playerX,INVERT_XZ);
            playerZneg.multiplyVectors(playerZ,INVERT_XZ);

            // we obtain the ray vectors by adding the player's viewdirection-vector to the position.
            // then we substract the ground point from the resulting vector and we're done

            rayDirectionXpos.subVectors(new THREE.Vector3().addVectors(playerPos,playerX),playerGround).normalize();
            rayDirectionXneg.subVectors(new THREE.Vector3().addVectors(playerPos,playerXneg),playerGround).normalize();
            rayDirectionZpos.subVectors(new THREE.Vector3().addVectors(playerPos,playerZ),playerGround).normalize();
            rayDirectionZneg.subVectors(new THREE.Vector3().addVectors(playerPos,playerZneg),playerGround).normalize();

            raycasterY.ray.origin.copy(playerGround);
            raycasterXpos.set(playerGround, rayDirectionXpos);
            raycasterXneg.set(playerGround, rayDirectionXneg);
            raycasterZpos.set(playerGround, rayDirectionZpos);
            raycasterZneg.set(playerGround, rayDirectionZneg);

        } else {

            raycasterYpos.ray.origin.copy(controls.getObject().position);
            raycasterY.ray.origin.copy(playerGround);
            raycasterXpos.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.PI)/2).normalize());
            raycasterXneg.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0,1,0), -(Math.PI)/2).normalize());
            raycasterZpos.set(controls.getObject().position, controls.getObject().getWorldDirection().normalize());
            raycasterZneg.set(controls.getObject().position, controls.getObject().getWorldDirection().negate().normalize());


        }

}

function fireAction() {
    if(flashCooldown==-1) {
        scene.add(flashLight);
        scene.fog.color.set(0xff0000);;
        flashCooldown=1;
        player.damage(300);
        flashInterval = setInterval(function () {
          flashCooldown--;
        }, 1000);
    }


}
