//Methods for XML-Parsing

// Path to Objects to read


// Starts parsing
function makeArrayFromXML(complete, arr, pathToXML) {
        var pathToFiles="";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                initObj(xhttp, complete, arr, pathToXML);
            }
        };


        xhttp.open("GET", pathToXML, true);
        xhttp.send();


}

// Parse Objects-Pathes into Array
function initObj(xml, complete, arr, pathToXML) {

    var xmlDoc = xml.responseXML;
    var pathToFiles = xmlDoc.getElementsByTagName("objects")[0].getAttribute("pathObjects");
    var pathToLevel = xmlDoc.getElementsByTagName("objects")[0].getAttribute("pathLevel");
    console.log(pathToFiles);
    var curobj = xmlDoc.getElementsByTagName("object");
    for (i = 0; i <curobj.length; i++) {
        var tmp = pathToFiles.concat(curobj[i].getAttribute("path"));
       // console.log(tmp);
        arr.push(tmp);

    }
    var curlvl = xmlDoc.getElementsByTagName("level");
    for (j = 0; j <curlvl.length; j++) {
        var tmp = pathToLevel.concat(curlvl[j].getAttribute("path"));
       // console.log(tmp);
        arr.push(tmp);

    }

    var level
    complete();

}
