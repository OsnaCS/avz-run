var ACTIVE_DISTANCE =35;



var interactionRayCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, ACTIVE_DISTANCE); // front

var outlineMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:true,wireframeLinewidth:5});

var activeObject;

var outlineMesh=null;



document.addEventListener( 'click', onMouseClick, false );

function interactionLoop() {
    interactionRayCaster.set(controls.getObject().position, controls.getDirection());
    interactions = interactionRayCaster.intersectObjects(terrain);
    //&& interactions[0].object.interactable==false
    if(interactions.length>0 && interactions[0].object.interactable) {

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
    } else {
        activeObject=null;
        if(outlineMesh!=null) {
            scene.remove(outlineMesh);
            outlineMesh=null;
        }
    }


}





gameObject = function(mesh, interaction, interactable) {
    this.interactable = interactable;
    this.mesh = mesh;
    this.interact = interaction;
    this.raycast = function(raycaster, intersects) {


        this.mesh.raycast( raycaster, intersects);
        if(intersects.length>0&&intersects[0].object==this.mesh) {
           intersects[0].object=this;
        }
    }
}



function onMouseClick() {
    if(activeObject!=null) {
        activeObject.interact();
    }


}
