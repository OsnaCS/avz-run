var ACTIVE_DISTANCE =40;

var interactionRayCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, ACTIVE_DISTANCE); // front

var outlineMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:true,wireframeLinewidth:5});

var activeObject;

var lockOpen = true;

var outlineMesh=null;
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

    this.activeTransponder = false;

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
    pickUpSound();
}


function destroy(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[0]){
        damageDoorSound();
        this.delFromScene();
        console.log('destroyed');
        player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function open() {
    doorSound();
    if(!this.open) {
        this.mesh.rotateY(Math.PI/2.0);
        this.open = !this.open;
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
        this.open = !this.open;
    }

}

function damage_door() {
    //check if axe is active item
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[0]){
        damaged_x = this.mesh.position.x;
        damaged_y = this.mesh.position.y;
        damaged_z = this.mesh.position.z;
        var damaged_door = ['tuer_halbkaputt.json'];

        damageDoorSound();

        addItem((damaged_door[0]), damaged_x, damaged_y, damaged_z, 1, true, destroy_door);
        this.delFromScene();
    }else{
        //Message for player? ("Wie könnte ich diese Tür wohl öffnen?")
    }
}

function destroy_door() {
    //check if axe is active item
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == newItemList[0]){
        // TODO:maybe message for player ("Die Tür ist kaputt, die Axt jetzt leider auch.")
        damaged_x = this.mesh.position.x;
        damaged_y = this.mesh.position.y;
        damaged_z = this.mesh.position.z;
        var destroyed_door = ['tuer_kaputt.json'];

        damageDoorSound();

        addItem((destroyed_door[0]), damaged_x, damaged_y, damaged_z, 1, false, 0);
        this.delFromScene();
        player.delActItem();

    }else{
        //Message for player? ("Das Loch ist noch nicht groß genug... wie könnte ich es wohl vergrößern?")
    }

}

function openLockedDoor() {
	if(lockOpen){
        doorSound();
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
	if(this.type == TYPE_FIRE && selectedItem.name == newItemList[12]){
        extinguisherSound();
    	delFire(this);
    	console.log('extinguished');
    	player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

// lappen.json muss durch den eigentlichen Namen ersetzt werden, dann ist die Methode nutzbar
function coverMouth(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == 'lappen.json'){
        startHeavyBreathing();
        HEALTH_PER_SECOND = HEALTH_PER_SECOND / 2;
        console.log('covered mouth');
        player.delActItem();
    }else{
        console.log('nicht anwendbar');
    }
}


function activateTransponder(){
    if(this.type == TYPE_INTERACTABLE && selectedItem.name == 'transponder.json'){
        successSound();
        selectedItem.activeTransponder = true;
        console.log('transponder activated');
    }else{
        console.log('nicht anwendbar');
    }
}


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
    }else{
        console.log('nicht anwendbar');
    }

}
