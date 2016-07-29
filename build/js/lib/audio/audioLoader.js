// Audio Loader
// Credits: Steffen Schiffel, B.Sc. for callback function optimization (CEO of Schiffel IT-Service GmbH)
// provides general inilization of audio related stuff
var audioListener, audioLoader, footsteps, atmosphere;
var footstepsPlaying = false;
var extinguisher_Sound,door_Sound,doorLocked_Sound,button_Sound,correct_Sound,
failed_Sound,success_Sound,pain_Sound,damageDoor_Sound,pickUp_Sound,
outOfBreath_Sound,gameOver_Sound, hbreathing_Sound;




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

    extinguisher_Sound = createSound("extinguisher", 10, 1, false, 7);
    door_Sound =  createSound("door-open", 10, 1, false, 20);
    doorLocked_Sound =  createSound("door-locked", 10, 1, false, 10);
    button_Sound =  createSound("button", 10, 1, false, 3);
    correct_Sound = createSound("correct", 10, 1, false, 4);
    failed_Sound = createSound("failed", 10, 1, false, 4);
    success_Sound = createSound("quest-success", 10, 1, false, 20);
    pain_Sound = createSound("pain", 10, 1, false, 6);
    damageDoor_Sound =  createSound("door-brake",50,5,false,3);
    pickUp_Sound = createSound("pickup",50,5,false,2);
    camera.add(pickUp_Sound);
    outOfBreath_Sound = createSound("run-breath",50,5,false,5);
    camera.add(outOfBreath_Sound);
    gameOver_Sound = createSound("gameover",50,5,false,1);
    camera.add(gameOver_Sound);
    hbreathing_Sound = createSound("breath", 10, 1, true, 0.2);
    camera.add(hbreathing_Sound);
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
