var itemList = [];
var pathToObjects;

SeveralItem = function(path, scale, interactive, name) {
    this.path =path;
    this.scale=scale;
    this.interactive=interactive;
    this.name=name;

}

function loadXmL(path){

    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
         if (xhttp.readyState == 4 && xhttp.status == 200) {
             saveItem(xhttp);
         }
     };
       xhttp.open("GET", path, true);
       xhttp.send();
       var xmlDoc = xhttp.responseXML;
       var tmp =xmlDoc.getElementsByTagName("Objects");
       pathToObjects=tmp[0].getAttribute("path");
 }

function saveItem(xml){
var xmlDoc = xhttp.responseXML;
    var allObjects = xmlDoc.getElementsByTagName("Object");
    for(i=0; i <allObjects.length;i++){
        var itemPath=pathToObjects.concat(allObjects[i].getAttribute("file"));
        var itemScale=allObjects[i].getAttribute("scale");
        var itemInteractive=allObjects[i].getAttribute("interactive");
        var itemName=allObjects[i].getAttribute("name");

        var itemObject= new SeveralItem(itemPath, itemScale, itemInteractive, itemName);
        itemList.push(itemObject);
    }


}

/*    function myFunction(xml) {
        var text = "";
        var xmlDoc = xml.responseXML;
        var curroom = xmlDoc.getElementsByTagName("room");
        for (i = 0; i <curroom.length; i++) {
            text += curroom[i].getAttribute("filename")+'<br>';
        }
        document.getElementById("FUU").innerHTML = text;
    }

    function getDoors(xml, whichroom) {
        var DoorArr = [];
        var text = "";
        var xmlDoc = xml.responseXML;
        var curroom = xmlDoc.getElementsByTagName("room");
        for (i = 0; i <curroom.length; i++) {
            if (curroom[i].getAttribute("name") === whichroom) {
                var curdoor = curroom[i].getElementsByTagName("door");
                for (j = 0; j < curdoor.length; j++) {
                    var cudo = [];
                    cudo.push(curdoor[j].getAttribute("index"));
                    cudo.push(curdoor[j].getAttribute("type"));
                    cudo.push(curdoor[j].getAttribute("position"));
                    cudo.push(curdoor[j].getAttribute("normal"));
                    DoorArr.push(cudo);
                }
            }
        }
        alert(DoorArr)
    }

*/
