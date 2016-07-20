// Controls camera via WASD/Mouse, enables player to duck and jump

// ---- NOTE: IF YOU WANT COLLISION TO WORK, ADD YOUR OBJECTS TO "TERRAIN" ----
// example: var meshX = new THREE.Mesh(geom, material);
// terrain.push(meshX);


window.addEventListener('load', init, false);

var scene,
camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
renderer, container, controls, clock, playerGround, playerPos, playerX,
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
var standupRequest = false;

var PLAYERHEIGHT = 30;
var DUCK_SPEED = 0.6; // speed at which player is crouching
var INVERT_XZ = new THREE.Vector3(-1,1,-1);








function init(event) {

    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();

    // add the objects
    createRoom();

    // start a loop that will update the objects' positions
    // and render the scene on each frame
    loop();
}

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



    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = 0;

    controls = new THREE.PointerLockControls(camera);
                scene.add(controls.getObject());

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
                            if (canJump === true &&!ducked) velocity.y += 300;
                            canJump = false;
                            break;

                        case 16: // shift out

                            if (!ducked) {
                                ducked = true;
                                mov_speed = 0.6;
                                PLAYERHEIGHT -= 20;

                                // change far plane of collision rays (as they
                                // are now parallel to XZ plane)
                                raycasterXpos.far = 3;
                                raycasterXneg.far = 3;
                                raycasterZpos.far = 3;
                                raycasterZneg.far = 3;
                            }

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

                        case 16: // shift out

                            // player might be unable to stand up, so this will
                            // be handled later
                            standupRequest=true;

                            break;

                    }

                };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // create rays for collision detection in each direction(direction values will be changed later)
    raycasterY = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 2); // beneath

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
            // raycasterY.ray.origin.y-=PLAYERHEIGHT;
            raycasterXpos.set(playerGround, rayDirectionXpos);
            raycasterXneg.set(playerGround, rayDirectionXneg);
            raycasterZpos.set(playerGround, rayDirectionZpos);
            raycasterZneg.set(playerGround, rayDirectionZneg);

        } else {

            raycasterYpos.ray.origin.copy(controls.getObject().position);
            raycasterY.ray.origin.copy(playerGround);
            //raycasterY.ray.origin.y+=20;
            raycasterXpos.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.PI)/2).normalize());
            raycasterXneg.set(controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle(new THREE.Vector3(0,1,0), -(Math.PI)/2).normalize() );
            raycasterZpos.set(controls.getObject().position, controls.getObject().getWorldDirection().normalize());
            raycasterZneg.set(controls.getObject().position, controls.getObject().getWorldDirection().negate().normalize());


        }

        // determine intersections of rays with objects that were added to terrain
        var intersectionsY = raycasterY.intersectObjects(terrain);
        var intersectionsYpos = raycasterYpos.intersectObjects(terrain);
        var intersectionsXpos = raycasterXpos.intersectObjects(terrain);
        var intersectionsZpos = raycasterZpos.intersectObjects(terrain);
        var intersectionsXneg = raycasterXneg.intersectObjects(terrain);
        var intersectionsZneg = raycasterZneg.intersectObjects(terrain);

        // determines stepwidth
        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // gravity
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;
        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;

        // move slower when ducked
        if(ducked){
            velocity.x *= DUCK_SPEED;
            velocity.z *= DUCK_SPEED;
        }




        // forbid player to move farther if there are obstacles in the respective directions
        if (intersectionsY.length > 0) {
            console.log("groundcollision");
            velocity.y = Math.max(0, velocity.y);
        }

        if(intersectionsZpos.length > 0) {
            velocity.z = Math.min(0, velocity.z);
        }

        if(intersectionsZneg.length > 0) {
            velocity.z = Math.max(0, velocity.z);
        }

        if(intersectionsXpos.length > 0) {
            velocity.x = Math.min(0, velocity.x);
        }

        if(intersectionsXneg.length > 0) {
            velocity.x = Math.max(0, velocity.x);
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        // stop gravity at ground level as collision detection sometimes fails for floor
        if (controls.getObject().position.y < PLAYERHEIGHT) {
            velocity.y = 0;
            controls.getObject().position.y = PLAYERHEIGHT;
        }

                // checks if we can stand up (may be forbidden when crouching beneath an object)
        if(standupRequest) {

            // stands up as soon as there are no more objects above
            if(intersectionsYpos.length == 0) {

                mov_speed = 1;
                PLAYERHEIGHT += 20;
                controls.getObject().position.y+=20;
                ducked=false;

                raycasterXpos.far = 32;
                raycasterXneg.far = 32;
                raycasterZpos.far = 32;
                raycasterZneg.far = 32;
                standupRequest=false;
            }

        }

        if(velocity.y == 0) {
            canJump=true;
        }

        prevTime = time;


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

    var cube = new THREE.Mesh(cubeGeom,materialBlue);

    cube.position.x = 80;
    cube.position.y = 15;



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
    cube.castShadow = true;


    scene.add(cube);
    scene.add(floor);
    scene.add(leftWall);
    scene.add(rightWall);
    scene.add(backWall);


}
