// Audio Loader
// Credits: Steffen Schiffel, B.Sc. for callback function optimization (CEO of Schiffel IT-Service GmbH)
// provides general inilization of audio related stuff
var audioListener, audioLoader, footsteps, atmosphere;
var footstepsPlaying = false;
var playFast;
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

// creates audio
function createSound(filename, loop, volume, complete) {
    var sound = new THREE.Audio(audioListener);
    audioLoader.load('/build/sounds/' + filename + '.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
        if(complete){
         complete();
        }
    });
    return sound;
}

// creates positional audio
function createPositionalSound(filename, distance, rolloff, loop, volume, complete) {
    var sound = new THREE.PositionalAudio(audioListener);
    audioLoader.load('/build/sounds/' + filename + '.mp3', function(buffer) {
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
    footsteps = createSound("footsteps", true, 1);
    atmosphere = createSound("atmosphere", true, 0.2, function(){
        atmosphere.play();
    });
    //console.log(footsteps);

    extinguisher_Sound = createSound("extinguisher", false, 7);
    door_Sound =  createSound("door-open", false, 20);
    doorLocked_Sound =  createSound("door-locked",  false, 10);
    button_Sound =  createSound("button", false, 3);
    correct_Sound = createSound("correct",  false, 4);
    failed_Sound = createSound("failed", false, 4);
    success_Sound = createSound("quest-success", false, 20);
    pain_Sound = createSound("pain", false, 6);
    damageDoor_Sound =  createSound("door-brake",false,3);
    pickUp_Sound = createSound("pickup",false,2);
    outOfBreath_Sound = createSound("run-breath",false,2);
    gameOver_Sound = createSound("gameover",false,1);
    hbreathing_Sound = createSound("breath", true, 0.2);
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
    if(sound.isPlaying || active || playFast == false) {
        sound.stop();
        sound.playbackRate = playbackNew;
        sound.play();
    }
    if(active){
        playFast = false;
    }
    else {
        playFast = true;
    }
}
