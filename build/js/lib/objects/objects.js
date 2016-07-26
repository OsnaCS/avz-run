var ObjArr =[];
var PathToObj="../avz_model/materials/objects/";
var ObjectsLoaded =false;
function loadObjects(complete) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                initObj(xhttp, complete);
            }
        };
        xhttp.open("GET", "../avz_model/materials/objects.xml", true);
        xhttp.send();


}


function initObj(xml, complete) {

    var text = "";
    var xmlDoc = xml.responseXML;
    var curobj = xmlDoc.getElementsByTagName("object");
    for (i = 0; i <curobj.length; i++) {

        console.log(curobj[i].getAttribute("path"));

    }
    ObjectsLoaded=true;
    complete();

}
