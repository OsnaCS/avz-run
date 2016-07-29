function addSmoke(x, y, z) {
    var textureLoader = new THREE.TextureLoader();
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
        'uniform vec3 fogColor;',
        'uniform float fogDensity;',
        'varying float progress;',
        'void main() {',
        'vec3 color = vec3( 1. );',

        // fog support
        'float depth = (gl_FragCoord.z / gl_FragCoord.w)+10.0;',
        'depth = depth * fogDensity * 3.0;',
        'gl_FragColor = texture2D( texture, gl_PointCoord ) * vec4( color, .3 * ( 1. - progress ))/depth;',
        '}',
    ].join('\n');

    texture = textureLoader.load('/build/levels/materials/textures/smoke.png');
    uniforms = {
        time: {
            type: 'f',
            value: 0
        },
        size: {
            type: 'f',
            value: fireWidth + fireDepth
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
            value: Math.abs(HEIGHT / (2 * Math.tan(THREE.Math.degToRad(camera.fov))))
        },
        fogColor: {type: "c", value: scene.fog.color},
        fogDensity: {type: "f", value: scene.fog.density},
    };
    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        fog: true
    });

    for (i = 0; i < NUM_OF_PARTICLE; i++) {

        position[i * 3 + 0] = THREE.Math.randFloat(-0.5 * (fireWidth / 1.5), 0.5 * (fireWidth / 1.5));
        position[i * 3 + 1] = THREE.Math.randFloat(y, y + (2 * fireHeight));
        position[i * 3 + 3] = THREE.Math.randFloat(-0.5 * (fireDepth / 1.5), 0.5 * (fireDepth / 1.5));
        shift[i] = Math.random() * 1;

    }
    geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.addAttribute('shift', new THREE.BufferAttribute(shift, 1));

    geometry.translate(x, 0, z);


    smoke = new THREE.Points(geometry, material);
    smoke.sortParticles = true;
    scene.add(smoke);

    return smoke;
}
