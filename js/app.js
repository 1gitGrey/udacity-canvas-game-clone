// ::BEFORE variables
var allItems = [];
var allEnemies = [];
var enemyPositionY = [83, 150, 220, 300]
var enemySpeeds = [101, 181, 201, 301, 420, 450, 700];
var selectionCharacters = ['images/Star.png', 'images/Heart.png', 'images/Key.png', 'images/Gem-orange.png', 'images/Gem-blue.png', 'images/Gem-green.png'];









/**
 * Game class
 *   -- constructs game class object that handles top level inputs and
 *  -- directs time, levels, and # of interactive peices together
 * @constructor
 *
 */
var Game = function() {

    // 0 index level array -1 means game has not yet started / 0 is boot screen

    this.level = -1;
    this.paused = false;
};

Game.prototype.handleInput = function(key) {
    switch (key) {
        case 'pause':
            this.paused = !this.paused;
            break;
        case 'space':
            this.paused = !this.paused;
            break;
        case 'help':
            //modal help info guide
        case 'info':
            //ditto
        default:
            return;

    }
};

Game.prototype.render = function() {
    if (player.life == 0) {
        this.stop = true;
        this.gameOver();
    }
};
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Utilities


/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Player class
 *   -- constructs player
 * @constructor
 *
 */
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = enemyPositionY[Math.floor(Math.random() * 3)]
    this.speed = enemySpeeds[Math.floor(Math.random() * 7)];
    allEnemies.push(this);

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + (this.speed * dt);
    if (this.x > ctx.canvas.width) {
        this.x = -101;
        this.y = this.y + 90;
        this.speed = enemySpeeds[Math.floor(Math.random() * 7)]
        if (this.y > 230) {
            this.y = 60;
        }
    }
};



// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Player class
 *   -- constructs player
 * @constructor
 *
 */
var Player = function() {
    this.sprite = 'images/char-boy.png'
    this.x = 404;
    this.y = 392;
    this.health = 7;





};


Player.prototype.reset = function() {
    this.x = 404;
    this.y = 392;


};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * update updates the life status , points, etc of user
 * @param {number} dt
 * @return {void}
 */

Player.prototype.update = function() {

    if (this.x > 804) {
        this.reset();
    } else if (this.y < 11) {
        this.reset();
    } else if (this.x < 0) {
        this.reset();
    } else if (this.y > 475) {
        this.reset();
    }

    if (this.health < 1) {
        this.isDead = true;
    }
}


/**
 * handleInput  handles user inputted keypresses
 * @param {string} key from code of key pressed
 * @return {void}
 */

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x > 0)
                this.x -= 100;
            break;
        case 'up':
            if (this.y > 0)
                this.y -= 83;
            break;
        case 'right':
            if (this.x < 900)
                this.x += 100;
            break;
        case 'down':
            if (this.y < 600)
                this.y += 83;
            break;
        default:
            return;

    };
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemyA = new Enemy();
var player = new Player();
var game = new Game();
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
        80: 'pause',
        32: 'space',
        72: 'help',
        73: 'info'

    };

    player.handleInput(allowedKeys[e.keyCode]);
    game.handleInput(allowedKeys[e.keyCode]);
});
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
