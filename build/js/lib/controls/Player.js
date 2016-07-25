var INV_SIZE = 3; // maximum number of objects in inventory
var inventory; // array that stores references to inventory items
var inv_pos; // array has constant length -> to save how many spots have been filled
var MAX_HEALTH= 1000;

// var healthBar = document.getElementsByClassName("progress-bar");

// player object with own inventory

Player = function() {

    this.health = MAX_HEALTH;

    inventory = new Array(INV_SIZE);
    inv_pos = 0;


    // stores item in inventory
    this.pickUp = function(game_obj) {

        // check if inventory has already been filled
        if (inv_pos < INV_SIZE) {

            // add object to array
            inventory[inv_pos] = game_obj;
            inv_pos++;

            // delete object representation from scene
            game_obj.delFromScene();
        }

        else {
            // object cannot be picked up, no storage room
            console.log('Inventar voll!')
        }

    }

    // look for an object needed for an interaction and use it if found
    this.use = function(game_obj) {

        // search inventory until object is found or everything was searched
        for(i = 0; inventory[i] != game_obj && i <= inv_pos; i++);

        // successfull interaction if object was found, delete from inventory
        // (may be altered for specific objects that can be used multiple times?)
        if (inventory[i] == game_obj) {
            inventory.splice(i, 1);
            inv_pos--;
            return true;
        }

        // no successful interaction
        else {
            return false;
        }

    }

    // śhows player's inventory (placeholder function)
    this.showInv = function() {

        console.log('Inventarinhalt:')

        for(i = 0; i < inv_pos; i++) {
            console.log(inventory[i]);
        }
    }

    this.damage = function (damage) {
        var healthPercent = (this.health/MAX_HEALTH)*100;
        this.health -= damage;
        $(".progress-bar").css("width",''+healthPercent+'%');
    }


}
