var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};
window.addEventListener('load', init, false);

var scene,
camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
renderer, container, controls, clock, raycaster;


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



var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var blocker = document.getElementById( 'world' );
var instructions = document.getElementById( 'world' );

var terrain = [];



var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {


    var element = document.getElementById('world');

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {


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

    var pointerlockerror = function ( event ) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();


    }, false );

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
    //scene.fog = new THREE.Fog( 0x151515, 0.5, 100 );
    //scene.fog = new THREE.FogExp2(0x424242, 0.02 );


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
    camera.position.z = 30;
    camera.position.y = 45;

    controls = new THREE.PointerLockControls( camera );
                scene.add( controls.getObject() );

                var onKeyDown = function ( event ) {

                    switch ( event.keyCode ) {

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
                            if ( canJump === true ) velocity.y += 350;
                            canJump = false;
                            break;

                        case 16: // shift out

                            controls.getObject().position.y -= 30;
                            break;

                    }

                };

                var onKeyUp = function ( event ) {

                    switch( event.keyCode ) {

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
                            controls.getObject().position.y  += 30;
                            break;

                    }

                };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycasterY = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 2 );

    raycasterXpos = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 1,0 ,0 ), 0, 15 );

    raycasterZpos = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 1 ), 0, 15 );

    raycasterXneg = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( -1, 0, 0 ), 0, 15 );

    raycasterZneg = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, -1 ), 0, 15 );




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



    // stats = new THREE.Stats();
    // container.appendChild( stats.dom );
    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}


function loop(){

    requestAnimationFrame(loop);



                    raycasterY.ray.origin.copy( controls.getObject().position );
                    raycasterXpos.set( controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle( new THREE.Vector3(0,1,0), (Math.PI)/2).normalize());
                    raycasterXneg.set( controls.getObject().position, controls.getObject().getWorldDirection().applyAxisAngle( new THREE.Vector3(0,1,0), -(Math.PI)/2).normalize()  );
                    raycasterZpos.set( controls.getObject().position, controls.getObject().getWorldDirection().normalize() );
                    raycasterZneg.set( controls.getObject().position, controls.getObject().getWorldDirection().negate().normalize() );


                    var intersectionsY = raycasterY.intersectObjects( terrain );

                    var intersectionsXpos = raycasterXpos.intersectObjects(terrain);

                    var intersectionsZpos = raycasterZpos.intersectObjects(terrain);;
                    var intersectionsXneg = raycasterXneg.intersectObjects(terrain);;
                    var intersectionsZneg = raycasterZneg.intersectObjects(terrain);;

                    var myfog += 0.000001;
                    scene.fog = new THREE.FogExp2( 0x424242, 0.0004 + myfog );

                    var time = performance.now();
                    var delta = ( time - prevTime ) / 1000;

                    velocity.x -= velocity.x * 10.0 * delta;
                    velocity.z -= velocity.z * 10.0 * delta;

                    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                    if ( moveForward ) velocity.z -= 400.0 * delta;
                    if ( moveBackward ) velocity.z += 400.0 * delta;

                    if ( moveLeft ) velocity.x -= 400.0 * delta;
                    if ( moveRight ) velocity.x += 400.0 * delta;

                    if (intersectionsY.length > 0) {
                        console.log("collision")
                        velocity.y = Math.max( 0, velocity.y );

                        canJump = true;
                    }

                    if(intersectionsZpos.length > 0) {
                        //alert('OBJECT IN BACK');
                        velocity.z = Math.min(0, velocity.z);
                    }

                    if(intersectionsZneg.length > 0) {
                         // alert('OBJECT FRONT');
                        velocity.z = Math.max(0, velocity.z);
                    }

                    if(intersectionsXpos.length > 0) {
                         // alert('OBJECT RIGHT');
                        velocity.x = Math.min(0, velocity.x);
                    }

                    if(intersectionsXneg.length > 0) {
                        // alert('OBJECT LEFT');
                        velocity.x = Math.max(0, velocity.x);
                    }

                    controls.getObject().translateX( velocity.x * delta );
                    controls.getObject().translateY( velocity.y * delta );
                    controls.getObject().translateZ( velocity.z * delta );

                    if ( controls.getObject().position.y < 0 ) {

                        velocity.y = 0;
                        controls.getObject().position.y = 0;

                        canJump = true;

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
    var cubeGeom = new THREE.BoxGeometry(30,30,30);
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

    cube.position.x = 0;
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
