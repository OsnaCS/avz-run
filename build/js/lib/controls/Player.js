var INV_SIZE = 3; // maximum number of objects in inventory
var inventory; // array that stores references to inventory items
var inv_pos; // array has constant length -> to save how many spots have been filled
var item_count;
var MAX_HEALTH = 20000; if (godmode) {MAX_HEALTH = 1000000};
var activeSlot = -1;
var selectedItem;
var critical_health = false;

// var healthBar = document.getElementsByClassName("health-bar");

// player object with own inventory

Player = function() {

    this.health = MAX_HEALTH;

    inventory = new Array(INV_SIZE);
    item_count = 0;

    // stores item in inventory
    this.pickUp = function(game_obj) {

        // check if inventory has already been filled
        if (item_count < INV_SIZE) {
            for (inv_pos = 0; inv_pos < INV_SIZE && inventory[inv_pos] != null; inv_pos++) {

            }
            // add object to array
            inventory[inv_pos] = game_obj;
            addIcon(game_obj, inv_pos);

            item_count++;

            // delete object representation from scene
            if(game_obj.mesh==undefined){
                octree.remove(game_obj);
            } else {
                octree.remove(game_obj.mesh);
            }
            game_obj.delFromScene();

        } else {
            // object cannot be picked up, no storage room
            console.log('Inventar voll!')
        }

    }


    // śhows player's inventory (placeholder function)
    this.showInv = function() {

        console.log('Inventarinhalt:')

        for (i = 0; i < inv_pos; i++) {
            console.log(inventory[i]);
        }
    }
//damages the player by given amount
    this.damage = function(damage) {
        var healthPercent = (this.health / MAX_HEALTH) * 100;
        this.health -= damage;
        $(".health-bar").css("width", '' + healthPercent + '%');
        if (!critical_health && this.health <= MAX_HEALTH/5) {
            critical_health = true;
            $(".health").css("box-shadow"," 0px 0px 20px 3px rgba(255, 82, 82, 0.6)");
        }
    }

    this.delActItem = function() {
        if (inventory[activeSlot] == selectedItem) {
            inventory[activeSlot] = null;
            selectedItem = "dummy.json";
            item_count--;
            removeIcon(activeSlot);
            setActiveSlot(-1);

        }
    }


}

//this creates a frame around the active slots(if there is an item in that slot)
function setActiveSlot(slot)  {
    if(slot == -1 || inventory[slot]!=null) {
        if(activeSlot>-1) {
            switch (activeSlot) {
                case 0:
                    $("#slot1").css("border", "2px solid rgba(255, 255, 255, 0.2)");
                    break;
                case 1:
                    $("#slot2").css("border", "2px solid rgba(255, 255, 255, 0.2)");
                    break;
                case 2:
                    $("#slot3").css("border", "2px solid rgba(255, 255, 255, 0.2)");
                    break;
            }
        }
        activeSlot = slot;

        switch (slot) {
            case 0:
                if (inventory[0] != null) {
                    $("#slot1").css("border", "2px groove #ffcc66");
                    selectedItem = inventory[0];
                }
                break;
            case 1:
                if (inventory[1] != null) {
                    $("#slot2").css("border", "2px groove #ffcc66");
                    selectedItem = inventory[1];
                }
                break;
            case 2:
                if (inventory[2] != null) {
                    $("#slot3").css("border", "2px groove #ffcc66");
                    selectedItem = inventory[2];
                }
                break;
        }
    }

}


function addIcon(item,slot) {
    var tName = item.name.split("/");
    tName = tName[tName.length-1];
    tName = tName.split(".")[0];
    console.log(tName);
    $("#slot"+(slot+1)).append("<img id='"+tName+"' src='icons/"+tName+".png'/>" );
}

function removeIcon(slot) {
    $("#slot"+ (slot+1) + " img:last-child").remove();
}

function gameOver() {
    $(".GUI").hide();
    $(".gameOverBlocker").show();
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    // Attempt to unlock
    document.exitPointerLock();
    $("#blocker").hide();
}
