function listallobjects() {  //wird gebraucht um zu gucken ob er smoothen muss, sowie eigentlich um den pfad anhand des namens zu finden (ist besser so als asynchron ausm xml)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var xmlDoc = xhttp.responseXML;
			var pfad = xmlDoc.getElementsByTagName("objects")[0].getAttribute("ObjectPath");
			var typeItems = xmlDoc.getElementsByTagName("objects")[0].getElementsByTagName("object");
			for (i = 0; i < typeItems.length; i++) {
				var path = pfad + typeItems[i].getAttribute("path");
				var obj = {pfad: path, name: typeItems[i].getAttribute("name"), scale: typeItems[i].getAttribute("scale"), smooth: typeItems[i].getAttribute("smooth"), icon: typeItems[i].getAttribute("icon")}
				allobjects.push(obj);
			}
		}
	};
	xhttp.open("GET", OBJECTSXML, true);
	xhttp.send();
}

function listallrooms() {  //wird gebraucht um zu gucken ob er smoothen muss, sowie eigentlich um den pfad anhand des namens zu finden (ist besser so als asynchron ausm xml)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var xmlDoc = xhttp.responseXML;
			var pfad = xmlDoc.getElementsByTagName("rooms")[0].getAttribute("RoomPath");
			var typeItems = xmlDoc.getElementsByTagName("rooms")[0].getElementsByTagName("room");
			for (i = 0; i < typeItems.length; i++) {
				var path = pfad + typeItems[i].getAttribute("filename");
				var obj = {pfad: path, name: typeItems[i].getAttribute("name"), smooth: typeItems[i].getAttribute("smooth")};
				allrooms.push(obj);
			}
		}
	};
	xhttp.open("GET", ROOMSXML, true);
	xhttp.send();
}

function shouldISmooth(file) {
	//für objecte
	for (var i = 0; i < allobjects.length; i++) {
		if (allobjects[i].pfad === file) {return allobjects[i].smooth}
	}
	//für rooms
	for (var i = 0; i < allrooms.length; i++) {
		if (allrooms[i].pfad === file) {return allrooms[i].smooth}
	}
	return false;
}


var FileLoader = function (callback) {

    var ready = false;
    var jsonLoader = new THREE.JSONLoader();

    // Pfad zu allen Dateien
    var files = [];

    for (var i = 0; i < newItemList.length; i++) {
        files.push(newItemList[i]);
    }

    // Key-Value-Store für die geladenen Dateien (Key: Name => Value: Inhalt)
    var loadedFiles = {};

    // Status des FileLoaders
    var filesSuccessfullyLoaded = 0;

    function loadJson(file, name) {
        jsonLoader.load(file,
            function (geometry, mat) {
                // on success:


                material = new THREE.MultiMaterial(mat);


                // Die Schleife ist dafür da, damit nur eine Seite der Objekte gerendert wird

      //           material.materials.forEach(function (e) {
      //               var basic = new THREE.MeshBasicMaterial();
      //               if (e instanceof THREE.MeshPhongMaterial || e instanceof THREE.MeshLambertMaterial) {

      // //                   e.shading=THREE.FlatShading;
      // //                   e.side = THREE.FrontSide;
						// // e.shininess = 6; //sorgt dafür dass die flächen weniger spiegeln
      //                   e=basic;
      //               }
      //           });
                for (var i = 0 ; i<material.materials.length;i++) {
                    if( material.materials[i].opacity==1) {
                        console.log(material.materials[i]);

                        var basic = new THREE.MeshLambertMaterial();
                        if(material.materials[i].map) {
                            basic.map = material.materials[i].map;
                        }
                        // basic.metalness=0;
                        // basic.roughness=0;
                        basic.color = material.materials[i].color;
                        basic.opacity =  material.materials[i].opacity;
                        basic.reflectivity =  material.materials[i].reflectivity;
                        basic.shading = THREE.FlatShading;
                        material.materials[i]=basic;

                    }
                }
                // Glättet die Objekte
                geometry.mergeVertices();

                if (!weaksystem) {
					if (shouldISmooth(file) !== "0") {
						geometry.computeVertexNormals(); //macht flächen runder
					}
				}



                loadedFiles[name] = new THREE.Mesh(geometry, material);

                filesSuccessfullyLoaded += 1;

                //checks if everything is loaded and hides loadbar and shows start button
                if (filesSuccessfullyLoaded == files.length) {
                    ready = true;
                    $("#loadingBlocker").hide();
                    $("#startInstructions").show();
                    console.log("FileLoader done.");
                    callback();
                }

                //updates loadingbar
                $(".loading-bar").css("width", ' ' + (filesSuccessfullyLoaded / file.length * 100) + '%');
            }
        );
    }


    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var h = file.split("/");
        var name = h[h.length - 1].split(".")[0];
        var type = h[h.length - 1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        loadJson(file, name);
    }

    //checks if everything is loaded after a set time periode
    setTimeout(
        function () {
            if (filesSuccessfullyLoaded != files.length) {
                ready = true;
                alert("Warnung! Es sind noch nicht alle Dateien geladen worden.");

                $("#loadingBlocker").hide();
                $("#startInstructions").show();
                console.log("FileLoader done.");
                callback();
            }

        }, MAXTIMEOUT
    );



    //initialize Audio-files

    // console.log("FileLoader done.");




    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden filesSuccessfullyLoaded == files.length

        //return (filesSuccessfullyLoaded==files.length);
        return true; //while objects.xml contains errors

    }

    // while(!ready) {
    //     console.log(ready);
    //     if(filesSuccessfullyLoaded == file.length) {
    //         ready=true;
    //     }
    // }

    // "public" Methoden:
    return {

        isReady: isReady,
        getAll: function () {
            // gibt alle geladenen Dateien zurück
            return isReady() ? loadedFiles : undefined;
        },
        get: function (name) {


            var result =loadedFiles[name].clone();

            return result;
        }
    }


};
