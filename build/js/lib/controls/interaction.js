var ACTIVE_DISTANCE = PLAYERHEIGHT * 1.6;

var interactionRayCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, ACTIVE_DISTANCE); // front

var outlineMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:true,wireframeLinewidth:5});

var activeObject;

var lockOpen = false; // pin pad boolean

var outlineMesh=null;

// pin pad variables.... may not be stored here?
var pin = new Array(4);
var transponder_config = new Array(2);
var pin_pos = 0;

var CORRECT_PIN = ['0','0','4','2'];
var CORRECT_TRANSPONDER = ['4','3'];
var TYPE_INTERACTABLE = 0;
var TYPE_FIRE = 1;
var TYPE_EXIT = 2;
var TYPE_TRIGGER = 3;
var FADE_TIME = 1200;



document.addEventListener( 'click', onMouseClick, false );

function interactionLoop() {

    //this gets called once per loop. shoots a ray in viewdirection
    interactionRayCaster.set(controls.getObject().position, controls.getDirection());
    interactions = interactionRayCaster.intersectObjects(terrain);

    //if it intersects something which is interactable we call its interaction function
    if(interactions.length>0 && interactions[0].object.type==TYPE_INTERACTABLE) {

        if(activeObject!=interactions[0].object) {
            scene.remove(outlineMesh);
            outlineMesh=null;
            activeObject= interactions[0].object;
            //if we switch objects we change the outline

        } else {
            //if we find an interactable object we outline it
            activeObject= interactions[0].object;
            if(outlineMesh==null) {
                outlineMesh = activeObject.mesh.clone();
                outlineMesh.material = outlineMaterial;
                outlineMesh.position.copy(activeObject.mesh.position);
                outlineMesh.is_ob = true;
                scene.add(outlineMesh);
            }


        }
    } else {
        //remove outline mesh if there are no interactive items found
        activeObject=null;
        if(outlineMesh!=null) {
            scene.remove(outlineMesh);
            outlineMesh=null;
        }
    }
            //reaching the exit
    if (interactions.length>0 && interactions[0].object.type==TYPE_EXIT) {
        // nextLevel(); TODO: implement somewhere
    }
    //
    if(interactions.length>0 && interactions[0].object.type==TYPE_FIRE) {
        console.log("interact");
        //this might be changed..
        if(activeObject!=interactions[0].object) {
            scene.remove(outlineMesh);
            outlineMesh=null;
            activeObject= interactions[0].object;


        } else {

            activeObject= interactions[0].object;
            if(outlineMesh==null) {
                outlineMesh = activeObject.mesh.clone();
                outlineMesh.material = outlineMaterial;
                outlineMesh.position.copy(activeObject.mesh.position);
                outlineMesh.is_ob = true;
                scene.add(outlineMesh);
            }


        }
    }

}



//this is a wrapper for meshes with a function, type and name
GameObject = function(mesh, interaction, type, name) {
    this.type = type;
    this.mesh = mesh;
    this.interact = interaction;


    this.name=name;

    this.open = false;
    //
    this.raycast = function(raycaster, intersects) {

        this.mesh.raycast( raycaster, intersects);
        if(intersects.length>0&&intersects[0].object==this.mesh) {
            intersects[0].object=this;
        }
    }

    // removes object from scene (e.g. when picked up)
    this.delFromScene = function() {

        scene.remove(this.mesh);
        scene.remove(outlineMesh);
        outlineMesh = null;

        // prohibit further interaction by removing from terrain
        for (i = 0; terrain[i] != this && i < terrain.length; i++);
        if (terrain[i] == this) terrain.splice(i,1);

    }

}

function onMouseClick() {
    if(activeObject!=null) {
        activeObject.interact();
    }
}

function pickUpItem() {
    player.pickUp(this);
    //pickUpSound();
}

function destroy(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[0]){
        //damageDoorSound();
        this.delFromScene();
        console.log('destroyed');
        player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function openopened() {
    //doorSound(); //TODO: das klappt nicht, sorry.
    if(!this.closed) {
        this.mesh.rotateY(Math.PI/2.0);
        this.closed = !this.closed;
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
        this.closed = !this.closed;
    }
}


function open() {
    //doorSound(); //TODO: das klappt nicht, sorry.
    if(!this.open) {
        this.mesh.rotateY(Math.PI/2.0);
        this.open = !this.open;
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
        this.open = !this.open;
    }
}

function damageDoor() {
    if((this.type == TYPE_INTERACTABLE) && (selectedItem != null) && (objectFilenameToName(selectedItem.name) == "axt")){
        damaged_x = this.mesh.position.x;
        damaged_y = this.mesh.position.y;
        damaged_z = this.mesh.position.z;
		damaged_rotate = this.mesh.rotation.y;
		damaged_scale = this.mesh.scale.x;
		

        //damageDoorSound(); //Todo: klappt wieder nicht, sorry :(
		
		//finde das Segment der Tür 
		
		
		addObjectViaName("halbbrokentur", "door", damaged_x-HOLZTURBREITE, damaged_y-HOLZTURBREITE, damaged_z, 1, damaged_rotate, "destroyDoor");
		
        this.delFromScene();
    }else{
        showThoughts("Wie könnte ich diese Tür wohl öffnen?",5000);
    }
}

function destroyDoor() {
    //check if axe is active item
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[0]){
        // TODO:maybe message for player ("Die Tür ist kaputt, die Axt jetzt leider auch.")
        damaged_x = this.mesh.position.x;
        damaged_y = this.mesh.position.y;
        damaged_z = this.mesh.position.z;
        var destroyed_door = ['tuer_kaputt.json'];

        //damageDoorSound();

        addItem((destroyed_door[0]), damaged_x, damaged_y, damaged_z, 1, false, 0);
        this.delFromScene();
        player.delActItem();

    }else{
        //Message for player? ("Das Loch ist noch nicht groß genug... wie könnte ich es wohl vergrößern?")
    }

}

function openLockedDoor() {
	if(lockOpen){
        //doorSound();
		if(!this.open) {
	        this.mesh.rotateY(Math.PI/2.0);
	        this.open = !this.open;
	    }
	    else {
	        this.mesh.rotateY(-Math.PI/2.0);
	        this.open = !this.open;
	    }
    }

}


var tempActObj;
// function for extinguish
function dFire(){
    delFire(tempActObj);
}

// Attach this function to the fire
function extinguish() {
	if(this.type == TYPE_FIRE && selectedItem.name == newItemList[12]){
        // activeObject must be saved so that the dFire function is not influence
        // be new activeObject selected during the delay
        tempActObj = activeObject;

      //  extinguisherAnimation();
        extinguisherSound();

        setTimeout(dFire, 1000);
    	console.log('extinguished');
    	player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}


// ***** robo lab pin pad *****

// open pin pad image and its HTML
function enterPin() {

    pin_pos = 0;

    // get object out of focus
    scene.remove(outlineMesh);
    outlineMesh = null;
    activeObject = null;

    // pause interaction loop
    menu = true;

    // show pin pad and make default pause screen invisible
    $("#pinPad").css("z-index", 20);
    $("#blocker").css("z-index", 0);
    $("#pinPad").show();

    // exit pointerLock so player can use cursor
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    console.log(document.exitPointerLock);
    document.exitPointerLock();
}

// return to game from pin pad
function exitPinPad() {

    // start loop again
    menu = false;

    // hide pin pad, reset blocker
    $("#blocker").css("z-index", 20);
    $("#pinPad").css("z-index", 0);
    $("#pinPad").hide();

    // determine if entered code was correct
    if (CORRECT_PIN[0] == pin[0] && CORRECT_PIN[1] == pin[1] && CORRECT_PIN[2] == pin[2] && CORRECT_PIN[3] == pin[3]) lockOpen = true;
    else lockOpen = false;

    // REPLACE WITH RESPECTIVE SOUND CALLS
    if (lockOpen) correctSound();
    else failedSound();

    // reset delta
    prevTime = performance.now();

    //ask browser to lock the pointer again
    element.requestPointerLock();

}

// handles input from HTML buttons that are invisible on the pin pad image

function pinPad(pinvalue) {

        // reset button focus
        document.activeElement.blur();
        buttonSound();

        switch (pinvalue) {

            case '10': // 'X' button was pressed to delete previously entered numbers

                // reset array, array position and display
                pin[0] = null;
                pin[1] = null;
                pin[2] = null;
                pin[3] = null;
                pin_pos = 0;

                document.getElementById("pinDisplay").innerHTML = "PIN EINGEBEN";
                break;

            case '11': // accept code

                exitPinPad();
                break;

            default:



                if (pin_pos<4) { // unless 4 digits have already been entered
                    pin[pin_pos] = pinvalue; // set current digit to entered number
                    pin_pos++;

                    // set display
                    document.getElementById("pinDisplay").innerHTML = pin.join("");
                }
                break;
        }
}


// ***** transponder "hack" *****
// (similar to pin pad handling, please look up pin pad comments)

function enterCH() {

    if(this.type == TYPE_INTERACTABLE ){ //&& selectedItem.name == "transponder"){ //TODO change
        pin_pos = 0;
        // get object out of focus
        scene.remove(outlineMesh);
        outlineMesh = null;
        activeObject = null;

        menu = true;

        $("#compHack").css("z-index", 20);
        $("#compHack").css("display","block");
        $("#compHack").show();

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        console.log(document.exitPointerLock);

        document.exitPointerLock();
    } else {
        console.log(selectedItem.name);
        console.log('nicht anwendbar');
    }

}


function exitCH() {

    $("#blocker").css("z-index", 20);
    $("#compHack").css("z-index", 0);
    $("#compHack").hide();

    // Ask the browser to lock the pointer
    menu = false;

    // determine if entered code was correct
    if (CORRECT_TRANSPONDER[0] == transponder_config[0] && CORRECT_TRANSPONDER[1] == transponder_config[1]){
        correctSound();
        selectedItem.activeTransponder = true;
    }
    else {
        failedSound();
        selectedItem.activeTransponder = false;
    }


    // reset delta
    prevTime = performance.now();

    element.requestPointerLock();
}

function compHack(hackButtonValue) {

        // reset button focus
        document.activeElement.blur();
        buttonSound();

        switch (hackButtonValue) {

            case '10':

                transponder_config[0] = null;
                transponder_config[1] = null;
                pin_pos = 0;
                document.getElementById("pinDisplayCH").innerHTML = "key lock:";
                break;

            case '11':

                exitCH();
                break;

            default:

                if (pin_pos<2) {
                    transponder_config[pin_pos] = hackButtonValue;
                    pin_pos++;
                    document.getElementById("pinDisplayCH").innerHTML = "key lock: " + transponder_config.join("");
                }
                break;

        }
}




// Attach this function to the sink
function coverMouth(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[31]){
        startHeavyBreathing();
        HEALTH_PER_SECOND = HEALTH_PER_SECOND / 2;
        addItem((newItemList[31]), playerPos[1], playerPos[2] + 10, playerPos[3], 2, 270, true, pickUpItem);
        console.log('covered mouth');
        player.delActItem();
    }else{
        console.log('nicht anwendbar');
    }
}


// Attach this function the door to be opened by a transponder
function openTransponderDoor(){

    if(selectedItem.activeTransponder){

            doorSound();
            if(!this.open) {

                this.mesh.rotateY(Math.PI/2.0);
                this.open = !this.open;
            }

            else {
                this.mesh.rotateY(-Math.PI/2.0);
                this.open = !this.open;
            }

            // transponder can only be used once
            selectedItem.activeTransponder = false;
            player.delActItem();

    } else{
        doorLockedSound();
        console.log('nicht anwendbar');
        // play doorLocked-Sound
        showThoughts("Verschlossen. Vielleicht kann ich die Tür mit einem Transponder öffnen.",5000);
    }
}


// can be used to bind events with parameters to game objects
// ALWAYS NEEDS EXTRA VARIABLE
// usage example:
// addTrigger(0,-50,partial(showThoughts, "Hello World",5000));

var partial = function (func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
};

// fadein/fadeout functions for thought box with event text
function showThoughts(text, duration) {
    $(".thoughtBox").html("» "+text+" «");
    $(".thoughtBox").fadeIn(FADE_TIME);
    showInterval = setInterval(hideThoughts, duration);
}

function hideThoughts() {
    $(".thoughtBox").fadeOut(FADE_TIME);
    showInterval = clearInterval();
}



/*
function extinguisherAnimation(){
    var particles = new THREE.Geometry;
    var particle;
    var particlenum = 40;

    var px = controls.getObject().position.x;
    var py = controls.getObject().position.y;
    var pz = controls.getObject().position.z;


    for (var i = 0; i < particlenum; i++) {
        particle = new THREE.Vector3( THREE.Math.randFloat(px, (tempActObj/particlenum) * i).mesh.position.x),THREE.Math.randFloat(py, tempActObj.mesh.position.y), THREE.Math.randFloat(pz, tempActObj.mesh.position.z));
        particles.vertices.push(particle);
    }

    var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });

    var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);

    scene.add(particleSystem);

    function deleteExtinguisherParticles(){
        scene.remove(particleSystem);
    }

    setTimeout(deleteExtinguisherParticles, 1000);
}
*/
