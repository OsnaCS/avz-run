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
                material.materials.forEach(function (e) {
                    if (e instanceof THREE.MeshPhongMaterial || e instanceof THREE.MeshLambertMaterial) {
                        e.side = THREE.FrontSide;
						e.shininess = 6; //sorgt dafür dass die flächen weniger spiegeln
                    }
                });
                // Glättet die Objekte
                geometry.mergeVertices();
                if (!weaksystem) geometry.computeVertexNormals(); //macht flächen runder

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

        }, 3000
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
            if(loadedFiles[name] === undefined){
                console.log(name + " is undefined")
            }
            var result =loadedFiles[name].clone();

            return result;
        }
    }


};
