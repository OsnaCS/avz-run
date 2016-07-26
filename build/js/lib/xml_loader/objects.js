
var ObjArr =[];
var PathToObj="../avz_model/materials/objects/";
var ObjectsLoaded =false;
function loadObjects(complete, arr) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                initObj(xhttp, complete, arr);
            }
        };
        xhttp.open("GET", "../avz_model/materials/objects.xml", true);
        xhttp.send();


}


function initObj(xml, complete, arr) {

    var text = "";
    var xmlDoc = xml.responseXML;
    var curobj = xmlDoc.getElementsByTagName("object");
    for (i = 0; i <curobj.length; i++) {
        var tmp = curobj[i].getAttribute("path");
       // console.log(tmp);
        arr.push(tmp);

    }
    ObjectsLoaded=true;
    complete();

}
