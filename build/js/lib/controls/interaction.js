var ACTIVE_DISTANCE =40;

var interactionRayCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, ACTIVE_DISTANCE); // front

var outlineMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:true,wireframeLinewidth:5});

var activeObject;

var lockOpen = false;

var outlineMesh=null;

// pin pad variables.... may not be stored here?
var pin = new Array(4);
var pin_pos = 0;

var CORRECT_PIN = ['0','4','2','0'];
var TYPE_INTERACTABLE = 0;
var TYPE_FIRE = 1;
var TYPE_EXIT = 2;
var TYPE_TRIGGER = 3;

document.addEventListener( 'click', onMouseClick, false );

function interactionLoop() {


    interactionRayCaster.set(controls.getObject().position, controls.getDirection());
    interactions = interactionRayCaster.intersectObjects(terrain);

    if(interactions.length>0 && interactions[0].object.type==TYPE_INTERACTABLE) {

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
    }else if (interactions.length>0 && interactions[0].object.type==TYPE_EXIT) {
        // nextLevel(); TODO: implement somewhere

    } else {
        activeObject=null;
        if(outlineMesh!=null) {
            scene.remove(outlineMesh);
            outlineMesh=null;
        }
    }


    if(interactions.length>0 && interactions[0].object.type==TYPE_FIRE) {
        console.log("interact");

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



GameObject = function(mesh, interaction, type, name) {
    this.type = type;
    this.mesh = mesh;
    this.interact = interaction;

    this.name=name;

    this.open = false;

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

}

function destroy(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == itemList[0]){
        this.delFromScene();
        console.log('destroyed');
        player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function open(){
    if(!this.open) {
        this.mesh.rotateY(Math.PI/2.0);
        this.open = !this.open;
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
        this.open = !this.open;
    }

}

function openLockedDoor(){
	if(lockOpen){
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


function extinguish() {
	if(this.type == TYPE_FIRE && selectedItem.name == itemList[6]){
    	delFire(this);
    	console.log('extinguished');
    	player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function enterPin() {
    console.log("öffnen");

    menu = true;
    activeObject = null;
    outlineMesh = null;
    scene.remove(outlineMesh);

    $("#pinPad").css("z-index", 20);

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    console.log(document.exitPointerLock);

    document.exitPointerLock();
}

function exitPinPad() {
    /* $("#pinPad").css("opacity","0");*/
    /*$("#blocker").css("z-index",20);*/
    console.log('exit');
     $("#pinPad").css("z-index", 0);

    // Ask the browser to lock the pointer
    menu = false;
    activeObject = null;
    outlineMesh = null;
    scene.remove(outlineMesh);


//    element = document.getElementById('world')
 //   element.requestPointerLock = element.requestPointerLock;

    element.requestPointerLock();

    if (CORRECT_PIN[0] == pin[0] && CORRECT_PIN[1] == pin[1] && CORRECT_PIN[2] == pin[2] && CORRECT_PIN[3] == pin[3]) lockOpen = true;
    else lockOpen = false;
    if (lockOpen) console.log('YEP');
    else console.log('NOPE');

}


function pinPad(pinvalue) {

        switch (pinvalue) {

            case '10':

                pin[0] = null;
                pin[1] = null;
                pin[2] = null;
                pin[3] = null;
                pin_pos = 0;
                document.getElementById("pinDisplay").innerHTML = "PIN EINGEBEN";
                break;

            case '11':

                exitPinPad();
                break;

            default:

                if (pin_pos<4) {
                    pin[pin_pos] = pinvalue;
                    pin_pos++;
                    document.getElementById("pinDisplay").innerHTML = pin.join("");
                }
                break;
        }






}
