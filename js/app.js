// ::BEFORE variables
var allItems = [];
var allEnemies = [];
var enemyPositionY = [83, 150, 220, 300]
var enemySpeeds = [101, 181, 201, 301, 420, 450, 700];
var selectionCharacters = ['images/Star.png', 'images/Heart.png', 'images/Key.png', 'images/Gem-orange.png', 'images/Gem-blue.png', 'images/Gem-green.png'];
var startbutton = document.getElementById('start');






/**
 * Game class
 *   -- constructs game class object that handles top level inputs and
 *  -- directs time, levels, and # of interactive peices together
 * @constructor
 *
 */
var Game = function() {

    // 0 index level array -1 means game has not yet started
    // 0 is level 1
    this.level = -1;
    this.minEnemySpeed = 1
    this.maxEnemySpeed = 5
        // start game in active state
    this.paused = false;


    this.player = new Player();
    this.allEnemies = [];
    this.selectChar = new SelectChar();

    this.selectChar.isActive = true;

    this.leveler();
};



Game.prototype.render = function() {
    if (player.life == 0) {
        this.stop = true;
        this.gameOver();
    }
};


Game.prototype.gameOver = function() {

        document.getElementById('canvas').classList.add('hide');



    }
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
    this.isDead = false;




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

/** Item Class
 * item that player uses to earn points, receive special powers, earn more health
 * @constructor
 */

var Item = function() {
    this.possibleX = [0, 100, 200, 300, 400, 500, 600, 800, 700];
    this.possibleY = [80, 160, 240, 320, 400, 480];
    this.x = this.randomizeX();
    this.y = this.randomizeY();
    allItems.push(this);
}

Item.prototype.randomizeX = function() {
    var xO = this.possibleX[Math.floor(Math.random() * this.possibleX.length)];
    return xO;

};
Item.prototype.randomizeY = function() {
    var yO = this.possibleY[Math.floor(Math.random() * this.possibleY.length)];
    return yO;
};
Item.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
};
Item.prototype.reset = function() {
    this.x = this.randomizeX();
    this.y = this.randomizeY();
}
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}

/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---
*/

var Health = function() {
    this.value = 7;
    this.sprite = "images/health.png";
    this.pair = document.getElementById('life')
};


Health.prototype.render = function() {
    var life = document.createElement("health");
    health.src = "images/health.png";
    for (i = 0; i < this.value; i++) {
        this.pair.appendChild(life);
    }
}

Health.prototype.update = function() {
    if (this.value < 1) {
        game.gameOver();
    }
}

Health.prototype.heal = function() {

    this.value = this.value + 1;

}

Health.prototype.hurt = function() {
    this.value = this.value - 1;
}

/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---
*/


/** Helper Class
 * item that player uses to earn points, receive special powers, earn more health
 * @constructor
 * @extends Item class
 */

var Helper = function() {
    Item.call(this);
    this.loadItem();
    this.reset();
}


Helper.prototype = Object.create(Item.prototype);
Helper.prototype.constructor = Helper;


Helper.prototype.loadItem = function() {
    this.possibleSprites = selectionCharacters;
    this.sprite = this.possibleSprites[Math.floor(Math.random() * this.possibleSprites.length)]

};

Helper.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



Helper.prototype.reset = function() {
    var dass = this;
    dass.x = -101;
    dass.y = -101;

    setInterval(function() {
        dass.loadItem();
        Item.prototype.reset.call(dass);
    }, 4500);

};
/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();
var player = new Player();
var enemyA = new Enemy();
var enemyB = new Enemy();
var enemyC = new Enemy();
var enemyD = new Enemy();
var enemyE = new Enemy();
var item = new Helper();
var health = new Health();
/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
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
        73: 'info',
        72: 'left',
        74: 'down',
        75: 'up',
        76: 'right'

    };

    player.handleInput(allowedKeys[e.keyCode]);
    game.handleInput(allowedKeys[e.keyCode]);
});
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
