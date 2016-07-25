// Audio Loader
// provides general inilization of audio related stuff
var audioListener, audioLoader;

// Init Audio
function createAudio() {
    // Init AudioListener
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Init AudioLoader
    audioLoader = new THREE.AudioLoader();
}
