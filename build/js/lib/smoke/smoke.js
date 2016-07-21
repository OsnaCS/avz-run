function addSmoke(x, y, z) {
    var smoke,
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

    // Vertex Shader
    vertexShader = [
        'attribute float shift;',
        'uniform float time;',
        'uniform float size;',
        'uniform float lifetime;',
        'uniform float projection;',
        'varying float progress;',
        'float cubicOut( float t ) {',
            'float f = t - 1.0;',
            'return f * f * f + 1.0;',
        '}',
        'void main() {',
            'progress = fract(time * 2. / lifetime + shift);',
            'float eased = cubicOut(progress);',
            'vec3 pos = vec3(position.x, position.y + eased, position.z);',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);',
            'gl_PointSize = (projection * size) / gl_Position.w;',
        '}',
    ].join('\n');

    // Fragment Shader
    fragmentShader = [
        'uniform sampler2D texture;',
        'varying float progress;',
        'void main() {',
            'vec3 color = vec3( 1. );',
            'gl_FragColor = texture2D( texture, gl_PointCoord ) * vec4( color, .3 * ( 1. - progress ) );',
        '}',
    ].join('\n');

    // Shader BackUp
    // vertexShader = document.getElementById('smoke-vertexshader').textContent;
    // fragmentShader = document.getElementById('smoke-fragmentshader').textContent;
    texture = textureLoader.load('./images/smoke.png');
    uniforms = {
        time: {
            type: 'f',
            value: 0
        },
        size: {
            type: 'f',
            value: 3
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
    };
    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    for (i = 0; i < NUM_OF_PARTICLE; i++) {

        position[i * 3 + 0] = THREE.Math.randFloat(-0.5, 0.5);
        position[i * 3 + 1] = THREE.Math.randFloat(y, y + 2);
        position[i * 3 + 3] = THREE.Math.randFloat(-0.5, 0.5);
        shift[i] = Math.random() * 1;

    }
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.addAttribute('shift', new THREE.BufferAttribute(shift, 1));

    geometry.translate(x, y, z);


    smoke = new THREE.Points(geometry, material);
    smoke.sortParticles = true;
    scene.add(smoke);

    return smoke;
}
