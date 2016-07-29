//Methods for XML-Parsing

// Path to Objects to read


// Starts parsing
function makeArrayFromXML(complete, arr) {
	makeArrayFromXML2(complete, arr, OBJECTSXML);
}

function makeArrayFromXML2(complete, arr, XMLPath) {
        var ObjectPath="";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                if (XMLPath === OBJECTSXML) loadobjectsxml(xhttp, complete, arr)
				else loadroomsxml(xhttp, complete, arr)
            }
        };
        xhttp.open("GET", XMLPath, true);
        xhttp.send();
}

// Parse Objects-Pathes into Array
function loadobjectsxml(xml, complete, arr) {

    var xmlDoc = xml.responseXML;
    var ObjectPath = xmlDoc.getElementsByTagName("objects")[0].getAttribute("ObjectPath");
    var IconPath = xmlDoc.getElementsByTagName("objects")[0].getAttribute("IconPath");

    var curobj = xmlDoc.getElementsByTagName("object");
    for (i = 0; i <curobj.length; i++) {
        var tmp = ObjectPath.concat(curobj[i].getAttribute("path"));
        arr.push(tmp);
    }

    var level
	makeArrayFromXML2(complete, arr, ROOMSXML);
}


function loadroomsxml(xml, complete, arr) {
    var xmlDoc = xml.responseXML;
    var ObjectPath = xmlDoc.getElementsByTagName("rooms")[0].getAttribute("RoomPath");
    var curobj = xmlDoc.getElementsByTagName("room");
    for (i = 0; i <curobj.length; i++) {
        var tmp = ObjectPath.concat(curobj[i].getAttribute("filename"));
        arr.push(tmp);
    }

    var level
    complete();
}
