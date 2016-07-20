var ambientLight, spotLight, spotLight2;

// ambient lighting
ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

// point lighting, disabled and replaced with spotlights
// var light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(0, 5, 2);
// light.power = 2;
// scene.add(light);


// SpotLights

// spot lighting #1
spotLight = new THREE.SpotLight(0xffce89);
spotLight.position.set(0,-7.5,2.45);
spotLight.distance = 4;
spotLight.decay = 2;
spotLight.power = 4;
spotLight.penumbra = 0.8;
spotLight.angle = -2.35619; // 135 degrees
scene.add(spotLight);

// spot lighting #2
spotLight = new THREE.SpotLight(0xffce89);
spotLight.position.set(0,-2.5,2.45);
spotLight.distance = 4;
spotLight.decay = 2;
spotLight.power = 4;
spotLight.penumbra = 0.8;
spotLight.angle = -2.35619; // 135 degrees
scene.add(spotLight);

spotLightX.position.set(0,-2.5,2.45);
scene.add(spotLightX);

// TODO: lightTarget Implementation
// // change direction of spotlight
// lightTarget = new THREE.Object3D();
// lightTarget.position.set(0,0,0);
// scene.add(lightTarget);
// spotLight.target = lightTarget;

// TODO: for-Schleife um den Raum in bestimmen Abständen mit Lampen / Licht zu füllen


