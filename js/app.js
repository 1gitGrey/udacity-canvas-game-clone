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
 *
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
 *

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

/*

var Health = function() {
    this.value = \      7
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
*/
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---
*


* Helper Class
 * item that player uses to earn points, receive special powers, earn more health
 * @constructor
 * @extends Item class


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

var Game = function() {

    this.level = -1;
    this.allLevels = [];
    this.player = new Player(this, 440, 500);
    this.allEnemies = [];
    this.minEnemySpeed = 1
    this.maxEnemySpeed = 5;
    this.scenario = null;
    this.selectChar = new SelectChar();
    this.SelectChar.isActive = true;
    this.paused = false;



    this.initLevels()
    this.initPlayer();
    this.initAllCallBacks();


    //   brings  this.level to 0
    this.nextLevel();
}

/**
 *==========================================================================
 *==========================================================================
 *----------------------------
 *------ Prototype Methods                        Game----------------------
 *============================
 *==========================================================================
 *--------------------------------------------------------------------------
 *==========================================================================
 */















Game.prototype.handleInput = function(key) {
    //  var that = this /> that.selectChar ...

    if (selectChar.isActive) {
        selectChar.handleInput(allowedKeys[e.keyCode])
    } else if (game.hasStarted) {
        player.handleInput(allowedKeys[e.keyCode])
    }


    switch (key) {
        case 'pause':
            this.paused = !this.paused;
            break;
        case 'space':
            this.paused = !this.paused;
            break;
        case 'enter':
            //modal help info guide
            startbutton.onclick();
        case 'info':
            this.paused = true;
        default:
            return;

    }
};





Game.prototype.nextLevel = function() {
    this.level++;

    if (this.level === this.levels.length) {
        this.gameOverCompleted(this);
        return
    }

    if (this.level < this.levels.length) {
        this.minEnemySpeed += 1;
        this.maxEnemySpeed += 1;

    }

    this.scenario = null;

    this.scenario = new Scenario(this.levels[this.level]);
    player.reset()
    this.allEnemies = [];

    this.maxEnemies = this.scenario.lanes.length;
    for (var i = 0; i < this.maxEnemies; i++) {
        var enemy = new Enemy(this, -1, this.scenario.lanes[i])

        enemy.speed = this.randomize(this.minEnemySpeed, this.maxEnemySpeed)
        this.allEnemies.push(enemy)
    }
    this.didSucceedCallBack(this.level);
}


Game.prototype.wasMyDudeHit = function() {
    if (this.player.isHero) {
        return false;
    }



    for (var i = 0; i < this.maxEnemies; i++) {

        if (this.checkCollision(this.player.x, enemy.x) && checkCollision(this.player.y, enemy.y)) {
            return true;
        }
    }

    return false;
}


Game.prototype.didMyDudeDrown = function() {
    return !this.player.isHero && this.scenario.getComponent(this.player.y, this.player.x) === Component.Water
}

Game.prototype.reset = function() {
    player.health--;
    if (player.health < 0) {
        this.gameOver();
    } else {
        this.healthDamageCallBack(player.health);
        this.scenario.resetItems();
        player.reset();
    }
}

Game.prototype.restart = function() {
    this.level = -1;
    this.minEnemySpeed = 1;
    this.maxEnemySpeed = 5;
    this.gameRestartCallBack(this);
    this.nextLevel();
}

Game.prototype.initLevels = function() {


    this.allLevels = [

        '5:3:1:GGGGGSSSSSGGGGG:nnnnnnnnnnnnnnn',
        '5:5:2,3:GGGGGWSWSWSSSSSSSSSSGGGGG:nnnnnnnnnnnnnnnngnnnnnnnn',
        '6:6:1,4:GGGGGGSSSSSSWWWWWWWWWWWWSSSSSSGGGGGG:nnnnnnnnnnnnnnnnnnnnnnnnnnnnrnnnnnnn',
        '5:6:2,3,4:GGGGGWWSWWSSSSSSSSSSSSSSSGGGGG:nnnnnnnnnnnnnnnnbnnnnnnnnnnnnn',
        '5:6:1,3,4:GGGGGSSSSSSSWSSSSSSSSSSSSGGGGG:nnnnnnnnnnngnbnnnnnnnnnnnnnnnn',
        '7:7:1,2,3,5:GGGGGGGSSSSSSSSSSSSSSSSSSSSSWWWSWWWSSSSSSSGGGGGGG:nnnnnnnnnnnnnnnnnnnnnnnnnnnnsnnnnnnnnrnnnnnnnnnnn',
        '5:5:1,3:GGGGGSSSSSSWSWSSSSSSGGGGG:nnnnnnnnnnnnnnnnnnnnnnnnn',
        '6:7:1,5:GGGGGGSSSSSSWSWSWSSWSWSWWSWSWSSSSSSSGGGGGG:nnnnnnnnnnnnnnnnnnnnnnnnnrnnnnnnnnnnnnnnnn',
        '5:5:1,2,3:WGWGWSSSSSSSSSSSSSSSGGGGG:nnnnnnnnnnnnnnnnnnnnnnnnn',
        '8:7:1,3,5:GGWWWWGGSSSSSSSSWWSSWWSSSSSSSSSSSSWWSSWWSSSSSSSSGGGGGGGG:nnnnnnnnnnnnnnnnnnnnnnngnnnnsnnnbnnnnnnnnnnnnnnnnnnnnnnn'

    ]
}

/**
 *==========================================================================
 *--------------------------------------------------------------------------
 *==========================================================================
 *==========================================================================
 *--------------------------------------------------------------------------
 *==========================================================================
 */

Game.prototype.initPlayer = function() {
    this.player.has(Item.Heart, function(player) {
        this.player.health++;
    });

    /**
     *@method -- if player gets a star
     *   he is inviincible for 1,5 seconds
     */
    this.player.has(Item.Star, function(player) {
        this.player.isHero = true;
        return

        var sprite = player.sprite;



        setTimeout(function() {
            player.isHero = false;
            player.sprite = sprite;

        }, 1500);
    });

    /**
     *@method -- key
     *
     */
    player.has(Item.key, function(game) {
        game.nextLevel();
    });


    /**
     *@method -- key
     *==========================================================================
     *--------------------------------------------------------------------------
     *==========================================================================
     */
    player.has(Item.Rock, function(game) {
        var pos = [];
        var level = game.level;
        for (var row = 0; row < game.senario.height; row++) {
            for (var col = 0; col < game.scenario.width; col++) {
                var component = game.scenario.getComponent(row, col);



                if (component === Component.Water) {
                    pos.push({ row: row, col: col });
                    game.scenario.setComponent(row, col, Component.Stone);
                }
            }
        }
    })

    /**
     *@method -- key
     *==========================================================================
     *--------------------------------------------------------------------------
     *==========================================================================
     */

    player.has(Item.BlueGem, function(game) {
        var speeds = [];
        for (var i = 0; i < game.maxEnemies; i++) {
            speeds.push(game.allEnemies[i].speed)
            game.allEnemies[i].speed = 0;
        }

        setTimeout(function() {
            if (game.level === level) {
                for (var i = 0; i < game.allEnemies.length; i++) {
                    game.allEnemies[i].speed = speeds[i];
                }
            }
        }, 1000);
    });


    /**
     *@method -- key
     *==========================================================================
     *--------------------------------------------------------------------------
     *==========================================================================
     */
    player.has(Item.GreenGem, function(game) {
        var level = game.level;
        for (var i = 0; i < game.allEnemies.length; i++) {
            game.allEnemies[i].speed = 0;
        }

        setTimeout(function() {
            if (game.level === level) {
                for (var i = 0; i < game.allEnemies.length; i++) {
                    game.allEnemies[i].speed *= 3;
                }
            }
        }, 1000);
    });




    /**
     *==========================================================================
     *@method -- key -----------------------------------------------------------
     *==========================================================================
     */



    player.has(Item.OrangeGem, function(game) {

    })
}


Game.prototype.initAllCallBacks = function() {
    this.healthDamageCallBack = function(health) {};
    this.healthHealCallBack = function(health) {};
    this.didSucceed = function(level) {};
    this.gaveOverCallBack = function(game) {};
    this.gameRestartCallBack = function(game) {};
    this.gameOverCompleted = function(game) {};
    this.paused = function(game) {};

};



Game.prototype.isLevelCleared = function() {
    return (this.player.y === 0) && (this.scenario.getComponent(player.x, player.x) === Component.Grass);
}


Game.prototype.checkCollision = function(a, b) {
    return Math.abs(a - b) < 0.1;
};

Game.prototype.randomize = function(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;




}





var Component = {

    Water: "W",
    Grass: "G",
    Stone: "S"



}


var Item = {


    BlueGem: 'b',
    GreenGem: 'g',
    OrangeGem: 'o',
    Heart: 'h',
    Key: 'k',
    Rock: 'r',
    Star: 's',
    None: 'n'
};

}
var Scenario = function(level) {

    var sceneMap = level.split(':');

    this.W = parseInt(sceneMap[0]);
    this.H = parseInt(sceneMap[1]);
    this.lanes = [];
    var laneMap = sceneMap[2].split(',');
    for (var i = 0; i < laneMap.length; i++) {
        this.lanes.push(parseInt(laneMap[i]))
    }
    this.components = sceneMap[3];

    if (sceneMap.length > 4) {
        this.allItems = sceneMap[4];
        this.initItems = this.allItems;

    }
};


Scenario.prototype.getComponent = function(row, col) {
    return this.components.charAt(row * this.W + col);

}



Scenario.prototype.setComponent = function(row, col, newComponent) {
    var index = row * this.W + col;
    this.components = this.components.substring(0, index) + new + this.components.substring(index + 1);

}



Scenario.prototype.getItem = function(row, col) {
    return this.allItems === undefined ? Item.None : this.allItems.charAt(row * this.W + col);
};


Scenario.prototype.setItem = function(row, col, newItem) {
    if (this.allItems === undefined) {
        this.allItems = '';
        for (var i = 0; i < this.components.length; i++) {
            this.allItems += 'n';
        }
    }
    var index = row * this.W + col;
    this.allItems = this.allItems.substring(0, index) + newItem + this.allItems.substring(index + 1);
}



Scenario.prototype.delItem = function(row, col) {
    this.setItem(row, col, Item.None);

};

Scenario.prototype.resetItem = function() {
        this.allItems = this.initItems;

    }
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
    /**
     * Player Class
     * Object representation of player on screen
     * @param {Game} The owner of player
     * @param {number} x initial
     * @param {number} y initial
     * @constructor
     */

var Character = function(game, x, y) {
    this.game = game;
    this.x = x,
        this.y = y;
    this.sprite = null;

};

// Draws char on screen @return {void}

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20)
}


/*------------------------------------------------------------------------
)--------------------------------------------------------------------------
)--------------------------------------------------------------------------
               Character Extensions
*/

/**
 * Enemy Class
 * Object representation of enemy on screen
 * @param {Game} The owner of player
 * @param {number} x initial
 * @param {number} y initial
 * @param {number} speed
 * @constructor
 * @extends {Character}
 */

var Enemy = function(game, x, y, speed) {
    Character.call(this, game, x, y);

    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Updates enemy pos at each loop of animation request
 * @param {number} dt elapsed time since loop
 * @return {void}
 */

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.x >= ctx.canvas.width) {
        this.x = -1;
        this.y = this.game.scenario.lanes[this.game.randomize(0, this.game.scenario.length - 1)];
        this.speed = this.game.scenario.randomize(this.game.minEnemySpeed, this.game.maxEneySpeed);
    }
};


/**
 * Player Class
 * Object representation of player on screen
 * @param {Game} The owner of player
 * @param {number} x initial
 * @param {number} y initial
 * @constructor
 * @extends {Character}
 */


var Player = function(game, x, y) {
    Character.call(this, game, x, y);
    this.sprite = 'images/char-boy.png';

    this.health = 7;
    om
    this.has = {};

    this.isHero = false;

};


Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {
    if (this.player.didSucceed()) {
        this.game.nextLevel();
    }
};

Player.prototype.has = function(item, callback) {
    this.has[item] = callback;
};

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

Player.prototype.reset = function() {
    this.x = this.randomize(0, ctx.canvas.width - 1);
    this..y = ctx.canvas.height - 1;
}
