/**
 * SelectChar (Select Character class)
 * @constructor
 *
 */

var SelectChar = function() {

    /**
     *
     *@type {Array.<object>}
     */
    this.allPlayers = null;

    /**
     * the current position
     * @type {number}
     */
    this.position = 0;


    /**
     *
     *@type {boolean}
     */
    this.isActive = false;

    /**
     * fn callled when character was selected
     *@type {function(object): void}
     *
     */
    this.didSelectCB = function(player) {};

}

/**
 * Definition for fn to call on the char selected
 * @param {function(object)); void} callback too call
 * @return {void}
 */



SelectChar.prototype.wasChosen = function(callback) {
    this.didSelectCB = callback;
}


/**
 * Key input handler for pre-board character selection
 * @param {string} key id pressed
 * @return {void}
 */

SelectChar.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.position > 0) {
                this.position--;
            }
            break;
        case 'right':
            if (this.position < this.allPlayers.length - 1) {
                this.position++;
            }
            break;
        case 'enter':
            if (this.position >= 0 && this.position <= this.allPlayers.length - 1) {
                this.didSelectCB(this.allPlayers[this.position]);
            }
            break;
        default:
            break;
    }
}
