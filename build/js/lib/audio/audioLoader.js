// Audio Loader
// Credits: Steffen Schiffel, B.Sc. for callback function optimization (CEO of Schiffel IT-Service GmbH)
// provides general inilization of audio related stuff
var audioListener, audioLoader, footsteps;
var footstepsPlaying = false;

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
function createSound(filename, distance, rolloff, loop, volume, complete) {
    var sound = new THREE.PositionalAudio(audioListener);
    audioLoader.load('sounds/' + filename + '.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(distance);
        sound.setRolloffFactor(rolloff);
        sound.setLoop(loop);
        sound.setVolume(volume);
        if(complete){
         complete();
        }
    });
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


// special behaviour for footsteps
function startFootsteps(){
    if(!footstepsPlaying){
        footsteps.play();
        footstepsPlaying = true;
    }
}

function stopFootsteps(){
    if(footstepsPlaying && !moveForward && !moveBackward && !moveRight && !moveLeft){
        footsteps.stop();
        footstepsPlaying = false;
    }
}
