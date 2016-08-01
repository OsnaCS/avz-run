var hbreathing_playing = false;

function extinguisherSound(){
    extinguisher_Sound.play();
}

function doorSound(){
    door_Sound.play();
}

function doorLockedSound(){
    doorLocked_Sound.play();
}

function buttonSound(){
    button_Sound.play();
}

function correctSound(){
    correct_Sound.play();
}

function failedSound(){
    failed_Sound.play();
}

// sound for coverd mouth
function startHeavyBreathing(){
    if(!hbreathing_playing){
        hbreathing_Sound.play();
        hbreathing_playing = true;
    }
}

function stopHeavyBreathing(){
    hbreathing_Sound.stop();
    hbreathing_playing = false;
}

function successSound(){
    success_Sound.play();
}

function painSound(){
    pain_Sound.play();
}

function damageDoorSound(){
    damageDoor_Sound.play();
}

function pickUpSound(){
    pickUp_Sound.play();
}

// sound when out of breath after running
function outOfBreathSound(){
    outOfBreath_Sound.play();
}

function gameOverSound(){
    gameOver_Sound.play();
}
