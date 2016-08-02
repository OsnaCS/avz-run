var hbreathing_playing = false;

function extinguisherSound(){
    playSound(extinguisher_Sound);
}

function doorSound(){
    playSound(door_Sound);
}

function doorLockedSound(){
    playSound(doorLocked_Sound);
}

function buttonSound(){
    playSound(button_Sound);
}

function correctSound(){
    playSound(correct_Sound);
}

function failedSound(){
    playSound(failed_Sound);
}

// sound for coverd mouth
function startHeavyBreathing(){
    if(!hbreathing_playing){
        playSound(hbreathing_Sound);
        hbreathing_playing = true;
    }
}

function stopHeavyBreathing(){
    stopSound(hbreathing_Sound);
    hbreathing_playing = false;
}

function successSound(){
    playSound(success_Sound);
}

function painSound(){
    playSound(pain_Sound);
}

function damageDoorSound(){
    playSound(damageDoor_Sound);
}

function pickUpSound(){
    playSound(pickUp_Sound);
}

// sound when out of breath after running
function outOfBreathSound(){
    playSound(outOfBreath_Sound);
}

function gameOverSound(){
    playSound(gameOver_Sound);
}
