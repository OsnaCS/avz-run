var ACTIVE_DISTANCE = PLAYERHEIGHT * 1.6;

var interactionRayCaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, ACTIVE_DISTANCE); // front

var outlineMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:true,wireframeLinewidth:5});

var activeObject;

var lockOpen = false; // pin pad boolean

var outlineMesh = null;

var extinguisherParticleSystem;
var coveredmouth = false;
var additional_healthloose = 0;
var heavybreath = false;
var shown_message = false; //ugh, ich weiß wie unelegant das ist >.<
var vielfog = false;

// pin pad variables initialisierung
var pin = new Array(4);
var transponder_config = new Array(2);
var pin_pos = 0;
var ch_pos = 0;
//correct_pin und correct_transponder werden pro level aus der levels.xml ausgelesen.


var TYPE_INTERACTABLE = 0;
var TYPE_FIRE = 1;
var TYPE_TRIGGER = 3;
var FADE_TIME = 1200;

var special_html_input = false;

var interObj;

var viewDirection = new THREE.Vector3();
document.addEventListener( 'click', onMouseClick, false );
var interIter;
var interIter2;

function interactionLoop() {

    //this gets called once per loop. shoots a ray in viewdirection
    interactionRayCaster.set(viewDirection.copy(controls.getObject().position), controls.getDirection().normalize());
    octreeInteractions = octree.search( interactionRayCaster.ray.origin, interactionRayCaster.far, true, interactionRayCaster.ray.direction );
    interactions = interactionRayCaster.intersectOctreeObjects( octreeInteractions);

    //if(interactions.length>0) console.log(getGameObject(interactions[0].object));
    // console.log(interactions);


    //if it intersects something which is interactable we call its interaction function
    if(interactions.length>0) {
        for(interIter = 0; interIter<interactions.length;interIter++) {
            interObj = getGameObject(interactions[interIter].object)
            if (interObj instanceof GameObject) break;
        }


        if( interObj.type==TYPE_INTERACTABLE) {

            if(activeObject!=interObj) {
                scene.remove(outlineMesh);
                outlineMesh=null;
                activeObject= interObj;
                //if we switch objects we change the outline

            } else {
                //if we find an interactable object we outline it
                activeObject= interObj;
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
    } else {
        //remove outline mesh if there are no interactive items found
        activeObject=null;
        if(outlineMesh!=null) {
            scene.remove(outlineMesh);
            outlineMesh=null;
        }
    }
            //reaching the exit
    if (interactions.length>0) {
        for(interIter2 = 0; interIter2<interactions.length;interIter2++) {
            interObj = getGameObject(interactions[interIter2].object)
            if (interObj instanceof GameObject) break;
        }
    }
    //
    if(interactions.length>0) {

        for(i = 0; i<interactions.length;i++) {
            interObj = getGameObject(interactions[i].object)
            if (interObj instanceof GameObject) break;
        }
        if(interObj.type==TYPE_FIRE) {
            //console.log("interact");
            //this might be changed..
            if(activeObject!=interObj) {
                //scene.remove(outlineMesh);
                //outlineMesh=null;
                activeObject= interObj;


            } else {

                activeObject= interObj;
                /*if(outlineMesh==null) {
                    outlineMesh = activeObject.mesh.clone();
                    outlineMesh.material = outlineMaterial;
                    outlineMesh.position.copy(activeObject.mesh.position);
                    outlineMesh.is_ob = true;
                    scene.add(outlineMesh);
                }*/


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
		console.log("deleted item")
		delGameObject(this.mesh);
    }

}

function nextLevel() {
	lockOpen = false;
	robolab = false;
	transponder_config = new Array(2);
	pin[0] = null; pin[1] = null; pin[2] = null; pin[3] = null; pin = new Array(4); pin_pos = 0;
	document.getElementById("pinDisplay").innerHTML = "PIN EINGEBEN";
	document.getElementById("pinDisplayCH").innerHTML = "key lock:";
	transponder_config[0] = null; transponder_config[1] = null; ch_pos = 0;

	if ((selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "transponder"))
	{
		selectedItem.activeTransponder = false;
		//TODO: ist das wirklich nur für selectedItem, muss ich das also für die anderen noch tun?
	}

    floornumber-=1;
	pause=true;
    recreateRoom();

}

function delGameObject(mesh) {
    octree.remove(mesh);

}

function getGameObject(mesh){
    for (var i = 0;i<octreeObjects.length;i++) {
        if(octreeObjects[i] != null && octreeObjects[i].mesh != undefined && octreeObjects[i].mesh == mesh) return octreeObjects[i];
    }
    return mesh;
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

function nix() {
	//damit ein interactible auch ohne interaction angezeigt werden kann braucht es diese dummy-funktion
}

function notopen() {
	showThoughts("Zu...",1500);
}

function destroy(){
    if(this.type == TYPE_INTERACTABLE && (selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "axt")){
        damageDoorSound();
        this.delFromScene();
        console.log('destroyed');
        player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function openopened() {
    doorSound();
    if(this.open) {
        this.mesh.rotateY(Math.PI/2.0);
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
    }
    this.open = !this.open;

    scene.remove(outlineMesh);
    outlineMesh = null;
    activeObject = null;
}

function openaftermessage() {
	if (!shown_message) {
		showThoughts("Da war eine Nachricht von Prof. Vornberger auf dem PC, die les ich besser!",4000);
	} else {
		doorSound();
		if(!this.open) {
			this.mesh.rotateY(Math.PI/2.0);
		}
		else {
			this.mesh.rotateY(-Math.PI/2.0);
		}
		this.open = !this.open;

		// mesh is removed
		scene.remove(outlineMesh);
		outlineMesh = null;
		activeObject = null;	
	}
}

function open() {
    doorSound();
    if(!this.open) {
        this.mesh.rotateY(Math.PI/2.0);
    }
    else {
        this.mesh.rotateY(-Math.PI/2.0);
    }
    this.open = !this.open;

    // mesh is removed
    scene.remove(outlineMesh);
    outlineMesh = null;
    activeObject = null;

}

function open_after_ext() {
	var notext = false;
	//welches feuer gelöscht sein muss ist hartgecoded, sorry. //TODO: ändern.
	for (var i = 0; i < fires.length; i++) {
		if (fires[i].index == "exit") notext = true;
	}
	if (notext) {
		showThoughts("Aua, ich stehe in Feuer, aua! Da öffne ich doch keine Tür!",5000);
	} else {
		doorSound();
		if(!this.open) {
			this.mesh.rotateY(Math.PI/2.0);
		}
		else {
			this.mesh.rotateY(-Math.PI/2.0);
		}
		this.open = !this.open;

		// mesh is removed
		scene.remove(outlineMesh);
		outlineMesh = null;
		activeObject = null;
	}
}

function getSegmentFromIntItem(intItem) {
	var j = -1;
	for (i = 0; i < interact_obj.length; i++) {
		if (interact_obj[i].interIt == intItem) {j = i; break;}
	}
	if (j > -1) {
		var d = interact_obj[j];
		return d;
	} else {
		alert("Something went terribly wrong.")
	}
}

function damageDoor() {
    if((this.type == TYPE_INTERACTABLE) && (selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "axt")){
		var d = getSegmentFromIntItem(this);
		addObjectViaName("halbbrokentur", "door", d.x, d.y, d.z, d.skale, d.rot, "destroyDoor", d.stretchx);
		remove_interactible(d);
		this.delFromScene();
        damageDoorSound();
    }else{
        showThoughts("Wie könnte ich diese Tür wohl öffnen?",5000);
    }
}

function destroyDoor() {
    if((this.type == TYPE_INTERACTABLE) && (selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "axt")){
		var d = getSegmentFromIntItem(this);
		addObjectViaName("brokentur", "door", d.x, d.y, d.z, d.skale, d.rot, "", d.stretchx);
		remove_interactible(d);
		this.delFromScene();
		player.delActItem();
		showThoughts("Die Tür ist kaputt, die Axt jetzt leider auch.",3000);
        damageDoorSound();
    }else{
        showThoughts("Das Loch ist noch nicht groß genug... wie könnte ich es wohl vergrößern?",5000);
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
    } else {
		showThoughts("Noch zu...")
	}

}


var tempActObj;
// function for extinguish
function dFire(){
    delFire(tempActObj);
}

// Attach this function to the fire
function extinguish() {
	if(this.type == TYPE_FIRE && (selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "feuerloescher")){
        // activeObject must be saved so that the dFire function is not influence
        // be new activeObject selected during the delay
        tempActObj = activeObject;

        extinguisherAnimation();
        extinguisherSound();

        setTimeout(dFire, 1000);
        console.log('extinguished');
        player.delActItem();
    }
    else{
        console.log('nicht anwendbar');
    }
}

function pfortnerliste() {
    showThoughts("Noch austragen und fertig!",5000);
}

// ***** robo lab pin pad *****

// open pin pad image and its HTML
function enterPin() {

    // pause interaction loop
    special_html_input = true;

    // show pin pad and make default pause screen invisible
    $("#pinPad").show();

    // exit pointerLock so player can use cursor
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.exitPointerLock();
}

// return to game from pin pad
function exitPinPad() {

    $("#pinPad").hide();
    // determine if entered code was correct
    if (allfloors[floornumber-1].correctpin[0] == pin[0] && allfloors[floornumber-1].correctpin[1] == pin[1] && allfloors[floornumber-1].correctpin[2] == pin[2] && allfloors[floornumber-1].correctpin[3] == pin[3]) {
        lockOpen = true;
        correctSound();
    } else {
        lockOpen = false;
        failedSound();
    }

    backToGame();

}

function showMessage() {
	shown_message = true;
	$("#message").fadeIn();
	special_html_input = true;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.exitPointerLock();	
}

function exitMessage() {
	$("#message").hide();
	backToGame();
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

    if(this.type == TYPE_INTERACTABLE && (selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "transponder")){

        special_html_input = true;

        $("#compHack").show();

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        console.log(document.exitPointerLock);

        document.exitPointerLock();
    } else {

        selectedItem != null  && selectedItem.name != undefined && console.log(selectedItem.name);
        console.log('nicht anwendbar');
		showThoughts("Hm, da ist ein Programm von der Raumverwaltung geöffnet...")
    }

}


function exitCH() {

    $("#compHack").hide();

    // determine if entered code was correct
    if (allfloors[floornumber-1].correcttransponder[0] == transponder_config[0] && allfloors[floornumber-1].correcttransponder[1] == transponder_config[1]){
        correctSound();
        selectedItem.activeTransponder = true;
    }
    else {
        failedSound();
        selectedItem.activeTransponder = false;
    }

   backToGame();
}

function compHack(hackButtonValue) {

        // reset button focus
        document.activeElement.blur();
        buttonSound();

        switch (hackButtonValue) {

            case '10':

                transponder_config[0] = null;
                transponder_config[1] = null;
                ch_pos = 0;
                document.getElementById("pinDisplayCH").innerHTML = "key lock:";
                break;

            case '11':

                exitCH();
                break;

            default:

                if (ch_pos<2) {
                    transponder_config[ch_pos] = hackButtonValue;
                    ch_pos++;
                    document.getElementById("pinDisplayCH").innerHTML = "key lock: " + transponder_config.join("");
                }
                break;

        }
}

function backToGame() {

    // reset delta
    prevTime = performance.now();

    //ask browser to lock the pointer again
    var element = document.getElementById('world');
    element.requestPointerLock();

    // activate controls
    controls.enabled = true;
    special_html_input = false;

    // remove focus from the object that was just used again
    scene.remove(outlineMesh);
    outlineMesh = null;
    activeObject = null;
}


// Attach this function the door to be opened by a transponder
function openTransponderDoor(){
    if(selectedItem != null && (selectedItem.name != undefined) && selectedItem.activeTransponder){
            doorSound();
			var d = getSegmentFromIntItem(this);
			var kind = "glastur"

			if (objectFilenameToName(d.filename) == "holztuer") kind = "holztur";

			addObjectViaName(kind, "door", d.x, d.y, d.z, d.skale, d.rot-1, "openopened", d.stretchx);
			remove_interactible(d);
			this.delFromScene();
            // if(!this.open) {
                // this.mesh.rotateY(Math.PI/2.0);
                // this.open = !this.open;
            // }

            // else {
                // this.mesh.rotateY(-Math.PI/2.0);
                // this.open = !this.open;
            // }
            // transponder can only be used once
            selectedItem.activeTransponder = false;
            player.delActItem();

    } else{
        doorLockedSound();
		if(selectedItem != null && objectFilenameToName(selectedItem.name) == "transponder")
		{
			console.log('Kein Transponder mit Code');
			showThoughts("Hm, dieser Transponder scheint noch nicht für diese Tür eingestellt zu sein...",5000)
		} else {
			console.log('kein Tranponder');
			showThoughts("Verschlossen. Vielleicht kann ich die Tür mit einem Transponder öffnen.",5000);
		}
    }
}

//
function robotControll(){
    robolab = !robolab;
    if(robolab){
        showThoughts("Ich habe den Roboter wieder angeschaltet",5000);
    } else{
        showThoughts("Ich habe den Roboter ausgeschaltet",5000);
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

function wakeUp() {
    showThoughts("Wo bin ich? Was ist passiert? Ich muss wohl eingeschlafen sein...",3000);
    $("#startScreen").css("display","inline-block").delay(5000);
    $("#startScreen").fadeOut(400);
    $("#startScreen").fadeIn(200).delay(100);
    $("#startScreen").fadeOut(250)
    $("#startScreen").fadeIn(400).delay(500);
    $("#startScreen").fadeOut(1400).delay(200);
    setTimeout(function(){showThoughts("Oh nein, es brennt! Ich sollte schnell raus!",5000);},9000);
}

function success() {
    console.log("YEY");
	pause = true;
    $("#endScreen").fadeIn(5000);
    $(".GUI").fadeOut(5000);
}

function useMedi(){
    if((selectedItem != null) && (selectedItem.name != undefined) && ((objectFilenameToName(selectedItem.name) == "ziegel") || (objectFilenameToName(selectedItem.name) == "medipack"))){ //das sollte definitiv anders TODO
		//play some "ugh, healed"-sound?
		showThoughts("Ahhh, das tut gut!", 5000);
		player.health = MAX_HEALTH;
        console.log('fully healed');
        player.delActItem();
	}
}

function useSponge(){
	if ((vielfog) && (coverMouth()))  {
		if (!nofog) myfog -= 0.008; if (myfog < 0.0001) myfog = 0.0001;
		showThoughts("Das sollte mir helfen!",5000);
		coveredmouth = true;
	}
}

function startRobos() {
	robolab = true;
	roboternum = 0;
	move();
}

function coverMouth(){
    if((selectedItem != null) && (selectedItem.name != undefined) && (objectFilenameToName(selectedItem.name) == "schwamm")){
        startHeavyBreathing();
		heavybreath = true;
        additional_healthloose = 0;
        //addItem((newItemList[31]), playerPos[1], playerPos[2] + 10, playerPos[3], 2, 270, true, pickUpItem);
        console.log('covered mouth');
        player.delActItem();
        return true;
    }else{
        return false;
    }
}

function makelessfog() {
		if (!coveredmouth) {
			if (!nofog) myfog -= 0.008; if (myfog < 0.0001) myfog = 0.0001;
		} else {
			coveredmouth = false;
		}
        console.log("Der Nebel lichtet sich");
		vielfog = false;
		additional_healthloose = 0;
		if (heavybreath) { stopHeavyBreathing(); heavybreath = false;}
}

function makemorefog() {
        console.log("Der Nebel dichtet sich");
		vielfog = true;
        if (coverMouth()) {
			showThoughts("Das sollte mir helfen!",5000);
			coveredmouth = true;
		}
        else {
			additional_healthloose = MAX_HEALTH/1500;
			if (!coveredmouth) if (!nofog) myfog += 0.008;
			showThoughts("Der Rauch ist zu dicht, ich kann kaum atmen. Vielleicht finde ich etwas, das ich mir vor den Mund halten kann. Besser raus hier.",5000)
			coveredmouth = false;
		}
}


function extinguisherAnimation(){
    var particles = new THREE.Geometry;
    var particle;
    var particlenum = 50;
    var texLoader = new THREE.TextureLoader();

    // Player position
    var px = controls.getObject().position.x;
    var py = controls.getObject().position.y - 3;
    var pz = controls.getObject().position.z;

    // Fire position
    var fx = tempActObj.mesh.position.x;
    var fy = tempActObj.mesh.position.y;
    var fz = tempActObj.mesh.position.z;

    var a,b,c;
    var spread = 0.3;

    for (var i = 0; i < particlenum; i++) {
        a = THREE.Math.randFloat(-spread, spread);
        b = THREE.Math.randFloat(-spread, spread);
        c = THREE.Math.randFloat(-spread, spread);
        particle = new THREE.Vector3(px + ((fx -px) / particlenum) * i + (a * i),
                                     py + ((fy -py) / particlenum) * i + (b * i),
                                     pz + ((fz -pz) / particlenum) * i + (c * i));
        particles.vertices.push(particle);
    }

    // Vertex Shader
    var vertexShader = [
        'attribute float shift;',
        'uniform float time;',
        'uniform float size;',
        'uniform float lifetime;',
        'uniform float projection;',
        'varying float progress;',
        'float cubicOut( float t ) {',
        'float f = t - 1.0;',
        'return f * f * f + 1.0;',
        '}',
        'void main() {',
        'progress = fract(time * 2. / lifetime + shift);',
        'float eased = cubicOut(progress);',
        'vec3 pos = vec3(position.x, position.y + eased, position.z);',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);',
        'gl_PointSize = (projection * size) / gl_Position.w;',
        '}',
    ].join('\n');

    // Fragment Shader
    var fragmentShader = [
        'uniform sampler2D texture;',
        'uniform vec3 fogColor;',
        'uniform float fogDensity;',
        'varying float progress;',
        'void main() {',
        'vec3 color = vec3( 1. );',

        // fog support
        'float depth = (gl_FragCoord.z / gl_FragCoord.w)+10.0;',
        'depth = depth * fogDensity * 3.0;',
        'gl_FragColor = texture2D( texture, gl_PointCoord ) * vec4( color, .3 * ( 1. - progress ))/depth;',
        '}',
    ].join('\n');

    var texture = texLoader.load('./levels/materials/textures/smoke2.png');
    var uniforms = {
        time: {
            type: 'f',
            value: 0
        },
        size: {
            type: 'f',
            value: 70
        },
        texture: {
            type: 't',
            value: texture
        },
        lifetime: {
            type: 'f',
            value: 10
        },
        projection: {
            type: 'f',
            value: Math.abs(HEIGHT / (2 * Math.tan(THREE.Math.degToRad(camera.fov))))
        },
        fogColor: {type: "c", value: scene.fog.color},
        fogDensity: {type: "f", value: scene.fog.density},
    };
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        fog: true
    });

    extinguisherParticleSystem = new THREE.Points(particles, material);

    scene.add(extinguisherParticleSystem);

    function deleteExtinguisherParticles(){
        scene.remove(extinguisherParticleSystem);
    }

    setTimeout(deleteExtinguisherParticles, 1000);
}
