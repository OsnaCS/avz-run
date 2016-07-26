//Audio-Variables



var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        // Texturen
        "test_level.json"



    ];
    for (var i = 0;i<itemList.length;i++) {
        files.push(pathItem.concat(itemList[i]));
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
                material = new THREE.MeshFaceMaterial(mat)
                loadedFiles[name] = new THREE.Mesh(geometry,material);
                filesSuccessfullyLoaded += 1;
            }
        );
    }

    function loadImage(file, name) {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // load texture
        textureLoader.load(file, function (texture) {
            loadedFiles[name] = texture;
            filesSuccessfullyLoaded += 1;
        });
    }

    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var h = file.split("/");
        var name = h[h.length-1].split(".")[0];
        var type = h[h.length-1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        switch (type) {
            case "json":
                loadJson(file, name);
                break;
            case "png": // no break!
            case "jpg": // no break!
            case "jpeg":
                loadImage(file, name);
                break;
            default:
                console.log("Error: unknown file format: "+file);
        }
    }


    //initialize Audio-files

    console.log("FileLoader done.");

    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden
        return (filesSuccessfullyLoaded == files.length);
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
            if (result == undefined) {
                console.log("FileLoader could not find texture '"+name+"'");
            }
            return result;
        }
    }
};
