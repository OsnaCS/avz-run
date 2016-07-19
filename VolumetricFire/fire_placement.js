var clock = new THREE.Clock();


function Addfire(x, y, z){

 var fireWidth  = 1.5;
    var fireHeight = 2;
    var fireDepth  = 3;
    var sliceSpacing = 1;

        var fire = new VolumetricFire(
        fireWidth,
        fireHeight,
        fireDepth,
        sliceSpacing,
        camera
    );

    var pointlight = new THREE.PointLight(0xff9933, 1, 1.5);
    pointlight.position.set(x, y+1, z);
    scene.add(pointlight);

    var fmesh = fire.mesh;
    scene.add(fmesh);
    fmesh.position.set(x, y + fireHeight / 2, z);


    (function animate_fire() {

        requestAnimationFrame(animate_fire);

        var elapsed = clock.getElapsedTime();

        pointlight.intensity = Math.sin(elapsed * 30) * 0.25 + 3;

        fire.update(elapsed);

    })();

  /*var smoke,
        NUM_OF_PARTICLE = 32,
        vertexShader,
        fragmentShader,
        texture,
        uniforms,
        material,
        geometry = new THREE.BufferGeometry(),
        position = new Float32Array(NUM_OF_PARTICLE * 3),
        shift = new Float32Array(NUM_OF_PARTICLE),
        i;

    vertexShader = document.getElementById('smoke-vertexshader').textContent;
    fragmentShader = document.getElementById('smoke-fragmentshader').textContent;
    texture = textureLoader.load('./images/smoke.png');
    uniforms = {
        time: {
            type: 'f',
            value: 0
        },
        size: {
            type: 'f',
            value: 20
        },
        texture: {
            type: 't',
            value: texture
        },
        lifetime: {
            type: 'f',
            value: 10
        },
        projection: {
            type: 'f',
            value: Math.abs(height / (2 * Math.tan(THREE.Math.degToRad(camera.fov))))
        }
    };*/

  }
