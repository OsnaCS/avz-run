var hbreathing;
var hbreathing_playing = false;

function extinguisherSound(){
    createSound("extinguisher", 10, 1, false, 7).play();
}

function doorSound(){
    createSound("door-open", 10, 1, false, 20).play();
}

function buttonSound(){
    createSound("button", 10, 1, false, 3).play();
}

function correctSound(){
    createSound("correct", 10, 1, false, 4).play();
}

function failedSound(){
    createSound("failed", 10, 1, false, 4).play();
}

function startHeavyBreathing(){
    if(hbreathing == null){
        hbreathing = createSound("breath", 10, 1, true, 0.3);
        camera.add(hbreathing);
    }

    if(!hbreathing_playing){
        hbreathing.play();
        hbreathing_playing = true;
    }
}

function stopHeavyBreathing(){
    hbreathing.stop();
    hbreathing_playing = false;
}

function successSound(){
    createSound("quest-success", 10, 1, false, 20).play();
}

function painSound(){
    createSound("pain", 10, 1, false, 6).play();
}

function damageDoorSound(){
    createSound("door-brake",50,5,false,3).play()
}

function pickUpSound(){
    createSound("pickup",50,5,false,5).play()
}

function outOfBreath(){
    var oob = createSound("run-breath",50,5,false,5).play()
    camera.add(oob);
    oob.play();
}
