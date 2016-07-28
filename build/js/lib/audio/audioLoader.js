// Audio Loader
// Credits: Steffen Schiffel, B.Sc. for callback function optimization (CEO of Schiffel IT-Service GmbH)
// provides general inilization of audio related stuff
var audioListener, audioLoader, footsteps, atmosphere;
var footstepsPlaying = false;

// init loader and listener
function createAudio(complete) {
    // Init AudioListener
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Init AudioLoader
    audioLoader = new THREE.AudioLoader();

    // basic sounds like footsteps
    createBasicSounds();
    complete();
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
    atmosphere = createSound("atmosphere", 10, 0.1, true, 0.5, function(){
        atmosphere.play();
    });
    camera.add(footsteps);
    camera.add(atmosphere);
}


// special behaviour for footsteps
function startFootsteps(){
    if(!footstepsPlaying){
        footsteps.playbackRate = 1;
        footsteps.play();
        footstepsPlaying = true;
    }
}

function stopFootsteps(){
    if(!canJump||(footstepsPlaying && !moveForward && !moveBackward && !moveRight && !moveLeft)){

        footsteps.stop();
        footstepsPlaying = false;
    }
}

function adjustPlaybackRate(sound, playbackNew, active){
    if(sound.isPlaying || active) {
        sound.stop();
        sound.playbackRate = playbackNew;
        sound.play();
    }
}
