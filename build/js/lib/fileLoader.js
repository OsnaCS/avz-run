//Audio-Variables



var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [];


    for (var i = 0;i<newItemList.length;i++) {
        files.push(newItemList[i]);
    }
	
    // Key-Value-Store für die geladenen Dateien (Key: Name => Value: Inhalt)
    var loadedFiles = {};

    // Status des FileLoaders
    var filesSuccessfullyLoaded = 0;

    function loadJson(file, name) {
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load(file,
            function (geometry,mat) {
                // on success:

                console.log("got:"+name);
                material = new THREE.MultiMaterial(mat)


                // Die Schleife ist dafür da, damit nur eine Seite der Objekte gerendert wird
                material.materials.forEach(function (e) {
                    if (e instanceof THREE.MeshPhongMaterial || e instanceof THREE.MeshLambertMaterial) {
                        e.side = THREE.FrontSide;
                    }
                });
                // Glättet die Objekte
                geometry.mergeVertices();
                // geometry.computeVertexNormals();



                loadedFiles[name] = new THREE.Mesh(geometry,material);

                filesSuccessfullyLoaded += 1;

                //checks if everything is loaded and hides loadbar and shows start button
                if(filesSuccessfullyLoaded == files.length){
                    //$(".loading").css("display" , " none" );
                    //$(".btn").css("display" , " inline-block" );
					$("#loadingBlocker").hide();
					$("#startInstructions").show();
                };

                //updates loadingbar
                $(".loading-bar").css("width" , ' '+ (filesSuccessfullyLoaded / file.length * 100) +'%');
            }
        );
    }


    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var h = file.split("/");
        var name = h[h.length-1].split(".")[0];
        var type = h[h.length-1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        loadJson(file, name);
    }

    //checks if everything is loaded after a set time periode
    window.setTimeout(
        function(){
            if(filesSuccessfullyLoaded != files.length){
                alert("Warning! Not all elements are loaded. Play at your own risk.");
                $("#loadingBlocker").hide();
                $("#startInstructions").show();
            }

        },3000
    );



    //initialize Audio-files

    console.log("FileLoader done.");

    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden filesSuccessfullyLoaded == files.length

        //return (filesSuccessfullyLoaded==files.length);
        return true; //while objects.xml contains errors

    }

    // "public" Methoden:
    return {

        isReady: isReady,
        getAll: function() {
            // gibt alle geladenen Dateien zurück
            return isReady() ? loadedFiles : undefined;
        },
        get: function(name) {
            var result = isReady() ? loadedFiles[name].clone() : undefined;
            console.log(name);

            if (result == undefined) {
                console.log("FileLoader could not find texture '"+name+"'");
            }
            return result;
        }
    }


};
