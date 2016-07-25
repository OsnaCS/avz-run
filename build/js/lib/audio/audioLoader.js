// Audio Loader
// provides general inilization of audio related stuff
var audioListener, audioLoader, footsteps;

// init loader and listener
function createAudio() {
    // Init AudioListener
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Init AudioLoader
    audioLoader = new THREE.AudioLoader();

    // basic sounds like footsteps
    createBasicSounds();
}

// creates the sound with specific options
function createSound(filename, distance, rolloff, loop, volume) {
    var sound = new THREE.PositionalAudio(audioListener);
    audioLoader.load('sounds/' + filename + '.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(distance);
        sound.setRolloffFactor(rolloff);
        sound.setLoop(loop);
        sound.setVolume(3);
    })
    return sound;
}

function playSound(sound) {
    sound.play();
}

function stopSound(sound) {
    sound.stop();
}

function createBasicSounds() {
    footsteps = createSound("footsteps", 10, 1, true, 1);
    camera.add(footsteps);
}
