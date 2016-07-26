var INV_SIZE = 3; // maximum number of objects in inventory
var inventory; // array that stores references to inventory items
var inv_pos; // array has constant length -> to save how many spots have been filled
var item_count;
var MAX_HEALTH= 10000;
var activeSlot=-1;
var selectedItem;

// var healthBar = document.getElementsByClassName("progress-bar");

// player object with own inventory

Player = function() {

    this.health = MAX_HEALTH;

    inventory = new Array(INV_SIZE);
    item_count = 0;

    // stores item in inventory
    this.pickUp = function(game_obj) {

        // check if inventory has already been filled
        if (item_count < INV_SIZE) {
            for(inv_pos = 0; inv_pos < INV_SIZE && inventory[inv_pos]!=null; inv_pos++){
                    
            }
            // add object to array
            inventory[inv_pos] = game_obj;
            addIcon(game_obj,inv_pos);
            
            item_count++;

            // delete object representation from scene
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

    this.damage = function(damage) {
        var healthPercent = (this.health / MAX_HEALTH) * 100;
        this.health -= damage;
        $(".progress-bar").css("width", '' + healthPercent + '%');
    }

    this.delActItem = function(){
        if(inventory[activeSlot] == selectedItem){
            inventory[activeSlot] = null;
            item_count--;
            
            setActiveSlot(-1);
        }
    }


}


function setActiveSlot(slot)  {
    if(slot == -1 || inventory[slot]!=null) {
        if(activeSlot>-1) {
            switch (activeSlot) {
                case 0:
                    $("#slot1").css("border", "0px solid yellow");
                    break;
                case 1:
                    $("#slot2").css("border", "0px solid yellow");
                    break;
                case 2:
                    $("#slot3").css("border", "0px solid yellow");
                    break;
            }
        }
            activeSlot=slot;

        switch (slot) {
            case 0:
                if(inventory[0]!=null) {
                    $("#slot1").css("border", "2px groove #ffcc66");
                    selectedItem=inventory[0];
                }
                break;
            case 1:
                if(inventory[1]!=null) {
                    $("#slot2").css("border", "2px groove #ffcc66");
                    selectedItem=inventory[1];
                }
                break;
            case 2:
                if(inventory[2]!=null) {
                    $("#slot3").css("border", "2px groove #ffcc66");
                    selectedItem=inventory[2];
                }
                break;
        }
    }

}


function addIcon(item,slot) {
  //  $("#slot"+slot).css("background-image","url("+item.name+".png)");
}
function gameOver() {
    $(".gameOverBlocker").css("z-index", 15);
}
