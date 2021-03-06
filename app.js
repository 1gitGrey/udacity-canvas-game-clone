/**
 * @fileoverview Classes for handling the game logic.
 * @author ftchirou@gmail.com (Faiçal Tchirou)
 */

/**
 * Game class.
 * Handles all the logic of the game (rules, levels, player, enemies, ...)
 * @constructor
 */
var Game = function () {
    /**
     * Current level index of the game.
     * The first level index is 0.
     * It is initialized at -1 because the game has not yet started.
     * @type {number}
     */
    this.level = -1;

    /**
     * All the levels of the game.
     * The levels have not yet been created.
     * @type {Array.<string>}
     */
    this.levels = [];

    /**
     * Player of the game. Initialized at position (0, 0)
     * @type {Player}
     */
    this.player = new Player(this, 0, 0);

    /**
     * Enemies of the game.
     * The game has not yet started, then
     * there is no enemy (the array {@code this.ememies} is empty).
     * @type {Array.<Enemy>}
     */
    this.allEnemies = [];

    /**
     * Minimum enemy speed.
     * @type {number}
     */
    this.minEnemySpeed = 1;

    /**
     * Maximum enemy speed.
     * @type {number}
     */
    this.maxEnemySpeed = 5;

    /**
     * Maximum number of player's lives.
     * @type {number}
     */
    this.maxLives = 3;

    /**
     * Current number of player's lives.
     * @type {number}
     */
    this.lives = this.maxLives;

    /**
     * Current game scenario.
     * The game must be started at a level
     * before {@code this.scenario} be initialized
     * to the appropriate scenario.
     * @type {Scenario}
     */
    this.scenario = null;

    /**
     * Game character selector.
     * @type {Selector}
     */
    this.selector = new Selector();

    // At the beginning, the character selector has the focus
    // to allow player selection.
    this.selector.isActive = true;

    /**
     * Whether the game is paused or not.
     * @type {boolean}
     */
    this.paused = false;

    // Initializes {@code this.levels}.
    // (Creates the levels of the game)
    this.initializeLevels();

    // Initializes {@code this.player}
    this.initializePlayer();

    // Initializes in-game events handlers.
    //this.initializeGameCallbacks();

    // Starts the game at level 0.
    this.levelUp();

    var that = this;
  /*  document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            72: 'help',
            13: 'enter',
            80: 'pause',
            81: 'quit'
        };

        if (that.selector.isActive) {
            that.selector.handleInput(allowedKeys[e.keyCode]);
        } else {
            that.player.handleInput(allowedKeys[e.keyCode]);
        }
    }); */
};

/**
 * Increments the current level index of the game. If
 * the level was the last level of the game, calls
 * {@code this.gameCompletedCallback(this)}, if not,
 * updates @code {Game} properties to match the
 * new current level.
 * @return {void}
 */
Game.prototype.levelUp = function () {
    // Goes to the next level.
    this.level++;

    // There is no remaining level.
    if (this.level === this.levels.length) {
        // All the levels have been cleared. Handles this
        // event by calling the following function.
        this.gameCompletedCallback(this);

        return;
    }

    // There are still some more levels to play.
    if (this.level < this.levels.length) {
        // For each level cleared, improve the chances of the enemies
        // to run faster.
        this.minEnemySpeed += 1;
        this.maxEnemySpeed += 1;

        // "Delete" the previous scenario.
        this.scenario = null;

        // Retrieves the current level {@code this.levels[this.level]}
        // and uses it to construct the new scenario.
        this.scenario = new Scenario(this.levels[this.level]);

        // Resets the number of lives.
        this.lives = this.maxLives;

        // The player has gained {@code this.maxLives}.
        // Calls the function to execute in that case.
        this.lifeGainedCallback(this.lives);

        // Put the player on the screen.
      //  this.spawnPlayer();
      this.player.reset();

        // "Delete" all the previous enemies.
        this.allEnemies = [];

        // The number of enemies equals the number
        // of "free lanes" of the scenario.
        this.numEnemies = this.scenario.lanes.length;
        for (var i = 0; i < this.numEnemies; ++i) {
            // Put an enemy on a free lane of the scenario.
            var enemy = new Enemy(this, -1, this.scenario.lanes[i]);

            // Assigns a random speed to each enemy.
            enemy.speed = this.randomInt(this.minEnemySpeed, this.maxEnemySpeed);

            this.allEnemies.push(enemy);
        }

        // The previous level was cleared. Handles this event
        // by calling the following function.
        this.levelClearedCallback(this.level);
    }
};

/**
 * @return {boolean} Whether the player was hit by an enemy.
 */
Game.prototype.didMyDudeDie = function () {
    if (this.player.trump) {
        return false;
    }

    // Iterates through {@code this.enemies} and checks
    // if one of the enemies is sufficiently close to the
    // player to consider that it hits him.
  /*  for (var i = 0; i < this.numEnemies; ++i) {
        var enemy = this.allEnemies[i];

        if (this.closeEnough(this.player.x, enemy.x) && this.player.y === enemy.y) {
            return true;
        }
    }
*/
    checkCollisions();
    return false;
};

/**
 * @return {boolean} Whether the player is not indesctructible and is on a water block on the scenario.
 */
Game.prototype.isPlayerDrowning = function () {
    return !this.player.trump && this.scenario.getComponent(this.player.y, this.player.x) === Component.Water;
};

/**
 * Pauses the game and call the function to execute when the game pauses.
 * @return {void}
 */
Game.prototype.pause = function () {
    if (!this.paused) {
        this.paused = true;
        this.gamePausedCallback(this);
    }
};

/**
 * Resumes the game and call the function to execute when the game resumes.
 * @return {void}
 */
Game.prototype.resume = function () {
    if (this.paused) {
        this.paused = false;
        this.gameResumedCallback(this);
    }
};

/**
 * Resets the game at the current level, usually
 * after the player has lost a life.
 * @return {void}
 */
Game.prototype.reset = function () {
    this.lives--;

    if (this.lives < 0) {
        this.gameOverCallback(this);
    } else {
        this.lifeLostCallback(this.lives);
        this.scenario.resetItems();
        //this.spawnPlayer();
        this.player.reset();
    }
};

/**
 * Restarts the game at the first level.
 * @return {void}
 */
Game.prototype.restart = function () {
    this.level = -1;
    this.minEnemySpeed = 1;
    this.maxEnemySpeed = 5;
    this.gameRestartCallback(this);
    this.levelUp();
};

/**
 * Resets {@code this.player} x and y coordinates.
 * @return {void}
Game.prototype.spawnPlayer = function () {
    this.player.x = this.randomInt(0, this.scenario.width - 1);
    this.player.y = this.scenario.height - 1;
};
*/
/**
 * Resets {@code this.player} (x, y) coordinates to
 * ({@code 0}, {@code this.scenario.height - 1}) and puts
 * an item at the bottom row of the scenario.
 * @return {void}
 */
Game.prototype.helpPlayer = function () {
    if (this.lives >= 1) {
        this.player.x = 0;
        this.player.y = this.scenario.height - 1;

        var items = [Item.Heart, Item.Star, Item.Key, Item.Rock, Item.BlueGem, Item.GreenGem];
        var item = items[this.randomInt(0, items.length - 1)];

        // Put the item in the first free cell of the last row of the scenario.
        var row = this.scenario.height - 1;
        for (var col = this.scenario.width - 1; col > 0; --col) {
            if (this.scenario.getItem(row, col) === Item.None) {
                this.scenario.setItem(row, col, item);
                this.lives--;
                this.lifeLostCallback(this.lives);

                break;
            }
        }
    }
};


/**
 * Assigns an array of string (each string describing a level) to {@code this.levels}.
 * <p>Each string of the array will be
 * passed to the {@code Scenario} constructor and defines how the scenario
 * will be rendered on the screen.</p>
 * <p>The format of each level is
 * <em>columns:rows:lanes:components:items</em> where
 * <ul>
 *      <li>columns (integer) : the number of columns of the scenario.</li>
 *      <li>rows (integer) : the number of rows of the scenario.</li>
 *      <li>lanes (integer list) : the row indexes on which enemies can be spawned.</li>
 *      <li>components (string of length columns x rows) : the map of the scenario. The valid characters
 *          of this string are the values of the {@code Component} enumeration.</li>
 *      <li>items (string of length columns x rows) : the map of the initial items on the scenario. The
 *          valid characters of this string are the values of the {@code Item} enumeration.</li>
 * </ul>
 * @return {void}
 */
Game.prototype.initializeLevels = function () {
    this.levels = [
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
    ];
};

/**
 * Initializes the player, in particular sets up
 * the various <em>gain</em> event handlers. That is
 * when the player gains a specific item.
 * @return {void}
 */
Game.prototype.initializePlayer = function () {
    this.player.has(Item.Heart, function (game) {
        this.player.heal();
      //  game.lifeGainedCallback(dw.lives);
    });

    this.player.has(Item.Star, function (game) {
        if (game.player.trump) {
            return;
        }

        game.player.trump = true;

        var sprite = game.player.sprite;

        // Use a different sprite for the player when he is trump.
        // This suppose that for a sprite name 'player.png', there is an
        // associated sprite name 'player-star.png'.
       // game.player.sprite = sprite.substring(0, sprite.length - 4) + '-star.png';

        // The player will return to normal (sadly) after 1 second.
        setTimeout(function () {
            game.player.trump = false;
            game.player.sprite = sprite;
        }, 1000);
    });

    this.player.has(Item.Key, function (game) {
        game.levelUp();
    });

    // All the water components on the scenario are turned into stone components
    // when the player gains a 'rock' item.
    this.player.has(Item.Rock, function (game) {
        var pos = []; // To keep track of the positions of the water components.
        var level = game.level;

        for (var row = 0; row < game.scenario.height; ++row) {
            for (var col = 0; col < game.scenario.width; ++col) {
                var block = game.scenario.getComponent(row, col);

                if (block === Component.Water) {
                    pos.push({row: row, col: col});
                    game.scenario.setComponent(row, col, Component.Stone);
                }
            }
        }

        setTimeout(function () {
            if (level === game.level) { // No need to undo the effects of this item if the player has already cleared the level.
                for (var i = 0; i < pos.length; ++i) {
                    game.scenario.setComponent(pos[i].row, pos[i].col, Component.Water);
                }
            }
        }, 1000);
    });

    // Each enemy speed will be divided by 3 if the
    // player gains a blue gem ...
    this.player.has(Item.BlueGem, function (game) {
        var level = game.level;
        for (var i = 0; i < game.allEnemies.length; ++i) {
            game.allEnemies[i].speed /= 3;
        }

        // ... for 1 second.
        setTimeout(function () {
            if (game.level === level) {
                for (var i = 0; i < game.allEnemies.length; ++i) {
                    game.allEnemies[i].speed *= 3;
                }
            }
        }, 1000);
    });

    // The enemies will be freezed for 1 second if the
    // player is in possession of a green gem.
    this.player.has(Item.GreenGem, function (game) {
        var speeds = []; // To keep track of the enemies previous speed.
        var level = game.level;

        for (var i = 0; i < game.numEnemies; ++i) {
            speeds.push(game.allEnemies[i].speed);
            game.allEnemies[i].speed = 0;
        }

        setTimeout(function () {
            if (game.level === level) {
                for (var i = 0; i < game.allEnemies.length; ++i) {
                    game.allEnemies[i].speed = speeds[i];
                }
            }
        }, 1000);
    });

    this.player.has(Item.OrangeGem, function (game) {
        // Nothing for now.
    });
};

/**
 * Sets up the default in-game events (life lost, life gained, game over, ...) handlers.
 * By default, nothing happens when an in-game event occurs.
 * @return {void}
 */
Game.prototype.initializeGameCallbacks = function () {
    /**
     * Function to call when the player looses a live.
     * Takes 1 argument (the remaining lives).
     * @type {function(number): void}
     */
    this.lifeLostCallback = function (lives) { };

    /**
     * Function to call when the player gains a live.
     * Takes 1 argument (the new lives).
     * @type {function(number): void}
     */
    this.lifeGainedCallback = function (lives) { };

    /**
     * Function to call when the player clears a level.
     * Takes 1 argument (the new level).
     * @type {function(number): void}
     */
    this.levelClearedCallback = function (level) { };

    /**
     * Function to call when the player has lost all his lives.
     * Takes 1 argument (the current game).
     * @type {function(Game): void}
     */
    this.gameOverCallback = function (game) { };

    /**
     * Function to call when the game starts or restarts.
     * Takes 1 argument (the current game).
     * @type {function(Game): void}
     */
    this.gameRestartCallback = function (game) { };

    /**
     * Function to call when all the levels of the game are cleared.
     * Takes 1 argument (the current game).
     * @type {function(Game): void}
     */
    this.gameCompletedCallback = function (game) { };

    /**
     * Function to call just after the game is paused.
     * Takes 1 argument (the current game).
     * @type {function(Game): void}
     */
    this.gamePausedCallback = function (game) { };

    /**
     * Function to call just after the game resumes.
     * Takes 1 argument (the current game).
     * @type {function(Game): void}
     */
    this.gameResumedCallback = function (game) { };
};

// The following Game.prototype.onXXXX functions are
// convenience functions to assign a function to
// the in-game events handlers.

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onLifeLost = function (callback) {
    this.lifeLostCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onLifeGained = function (callback) {
    this.lifeGainedCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onLevelCleared = function (callback) {
    this.levelClearedCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onGameOver = function (callback) {
    this.gameOverCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onGameRestart = function (callback) {
    this.gameRestartCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onGameCompleted = function (callback) {
    this.gameCompletedCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onGamePaused = function (callback) {
    this.gamePausedCallback = callback;
};

/**
 * @param {function(Game): void} callback.
 * @return {void}
 */
Game.prototype.onGameResumed = function (callback) {
    this.gameResumedCallback = callback;
};

/**
 * Checks if the player has cleared the current level.
 * A level is cleared when the player is at the top row
 * of the scenario {@code this.player.y === 0} and on a grass block
 * {@code this.scenario.getComponent(this.player.y, this.player.x) === Component.Grass}
 * @return {boolean} true if the level is cleared.
 */
Game.prototype.isLevelCleared = function () {
    return (this.player.y === 0) && (this.scenario.getComponent(this.player.y, this.player.x) === Component.Grass);
};

/**
 * Checks if 2 real numbers are close enough (can be considered equal in the purpose of the game).
 * If their difference is less than 0.1, they are considered equal.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @return {boolean} Whether the 2 numbers are close enough.
 */
Game.prototype.closeEnough = function (a, b) {
    return Math.abs(a - b) < 0.1;
};

/**
 * Generates a random integer between 2 numbers.
 * @param {number} min The minimum integer which could be generated.
 * @param {number} max The maximum integer which could be generated.
 * @return {number} The generated number.
 */
Game.prototype.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 * Component types which compose the scenario.
 * @enum {string}
 */
var Component = {
    Water: 'W',
    Grass: 'G',
    Stone: 'S'
};

/**
 * Kinds of items which can be available on the scenario.
 * @enum {string}
 */
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

/**
 * Scenario class.
 * Represents the scenario on which the game is played.
 * It is the first layer rendered.
 * @param {string} level A string representation of the scenario (columns:rows:lanes:components:items).
 * @constructor
 */
var Scenario = function (level) {
    // Array of strings containing the different parts of the scenario.
    // data[0] = number of columns.
    // data[1] = number of rows.
    // data[2] = list of lanes.
    // data[3] = scenario map.
    // data[4] = items map.
    var data = level.split(':');

    /**
     * Number of columns of the scenario.
     * @type {number}
     */
    this.width = parseInt(data[0]);

    /**
     * Number of rows of the scenario.
     * @type {number}
     */
    this.height = parseInt(data[1]);

    /**
     * List of row indexes on which enemies can be spawned.
     * @type {Array.<number>}
     */
    this.lanes = [];

    // An array of string, each string is a row index.
    var lanesData = data[2].split(',');
    for (var i = 0; i < lanesData.length; ++i) {
        // Convert each lanesData element to int and
        // append it to {@code this.lanes}
        this.lanes.push(parseInt(lanesData[i]));
    }

    /**
     * Components composing the scenario. Each block value must be
     * one of the values of the enumeration {@code Component}.
     * @type {string}
     */
    this.components = data[3];

    // The items part of the string {@code level} may be
    // omitted. We must then check if it is available
    // before manipulating it.
    if (data.length > 4) {
        /**
         * Items available on the scenario. Each item value
         * must be one of the values of the enumeration {@code Item}.
         * @type {string}
         */
        this.items = data[4];

        /**
         * Initial items configuration of the scenario.
         * Can be used to reset {@code this.items} to its
         * initial value.
         * @type {Array.<string>}
         */
        this.initialItems = this.items;
    }
};

/**
 * Gets the block at position (row, col).
 * @param {number} row The x position of the block.
 * @param {number} col The y position of the block.
 * @return {Component}
 */
Scenario.prototype.getComponent = function (row, col) {
    return this.components.charAt(row * this.width + col);
};

/**
 * Changes the value of the block at position (row, col).
 * @param {number} row The x position of the block.
 * @param {number} col The y position of the block.
 * @param {Component} the new block value.
 * @return {void}
 */
Scenario.prototype.setComponent = function (row, col, newComponent) {
    var index = row * this.width + col;

    this.components = this.components.substring(0, index) + newComponent + this.components.substring(index + 1);
};

/**
 * Gets the item at position (row, col).
 * @param {number} row The x position of the item.
 * @param {number} col The y position of the item.
 * @return {Item}
 */
Scenario.prototype.getItem = function (row, col) {
    return this.items === undefined ? Item.None : this.items.charAt(row * this.width + col);
};

/**
 * Changes the value of the item at position (row, col).
 * @param {number} row The x position of the item.
 * @param {number} col The y position of the item.
 * @param {Item} the new item value.
 * @return {void}
 */
Scenario.prototype.setItem = function (row, col, newItem) {
    // In case, there were no items at the beginning of the game,
    // initialize {@code this.items} before modifying it.
    if (this.items === undefined) {
        this.items = '';
        for (var i = 0; i < this.components.length; ++i) {
            this.items += 'n';
        }
    }

    var index = row * this.width + col;

    this.items = this.items.substring(0, index) + newItem + this.items.substring(index + 1);
};

/**
 * Sets the item at position (row, col) to {@code Item.None}
 * @param {number} row The x position of the item.
 * @param {number} col The y position of the item.
 * @return {void}
 */
Scenario.prototype.removeItem = function (row, col) {
    this.setItem(row, col, Item.None);
};

/**
 * Restores {@code this.items} at its initial value.
 * @return {void}
 */
Scenario.prototype.resetItems = function () {
    this.items = this.initialItems;
};

/**
 * Character class.
 * Represents any character on the scenario.
 * @param {Game} game The game the character belongs to.
 * @param {number} x The initial x position of the character.
 * @param {number} y The initial y position of the character.
 * @constructor
 */
var Character = function (game, x, y) {
    /**
     * Game the character belongs to.
     * @type {Game}
     */
    this.game = game;

    /**
     * x position of the character.
     * @type {number}
     */
    this.x = x;

    /**
     * y position of the character.
     * @type {number}
     */
    this.y = y;

    /**
     * Path to the sprite file of the character.
     * @type {string}
     */
    this.sprite = null;
};

/**
 * Draws the character on the game canvas.
 * @return {void}
 */
Character.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20); // -20 to "center" the character on a block.
};


/**
 * Enemy class.
 * Represents an enemy in the game.
 * @param {Game} game The game the enemy belongs to.
 * @param {number} x The initial x position of the enemy.
 * @param {number} y The initial y position of the enemy.
 * @param {number} speed The initial speed of the enemy.
 * @constructor
 * @extends {Character}
 */
var Enemy = function(game, x, y, speed) {
    Character.call(this, game, x, y);

    this.sprite = 'images/enemy-bug.png';

    /**
     * Current speed of the enemy.
     * @type {number}
     */
    this.speed = speed;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Updates the enemy position at each frame.
 * @param {number} dt The elapsed time since the last update.
 * @return {void}
 */
Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt; // this.x = this.x + ds where ds (distance travelled during dt) = speed * dt.

    if (this.x >= this.game.scenario.width) {
        // Spawn an enemy at the left, off the scenario to have the impression that
        // the lanes are not limited by the dimensions of the scenario.
        this.x = -1;

        // Randomely choose a lane on which spawn the enemy.
        this.y = this.game.scenario.lanes[this.game.randomInt(0, this.game.scenario.lanes.length - 1)];

        // Randomely choose a speed at which the enemy will run between enemies minimal and maximal speeds.
        this.speed = this.game.randomInt(this.game.minEnemySpeed, this.game.maxEnemySpeed);
    }
};


/**
 * Player class.
 * Represents the player in the game.
 * @param {Game} The game the player belongs to.
 * @param {number} x The initial x position of the player.
 * @param {number} y The initial y position of the player.
 * @constructor
 * @extends {Character}
 */
var Player = function (game, x, y) {
    Character.call(this, game, x, y);
    this.sprite = 'images/char-boy.png';

    /**
     * Object mapping keys of type {@code Item}
     * to functions of type {@code function(Game): void}
     * When the player gains an item, the corresponding
     * function will be called.
     * @dict
     */
    this.gainCallbacks = { };

    /**
     * If this is true, the player does not undergo any
     * damage by enemies and can not drown.
     * @type {boolean}
     */
    this.trump = false;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * Checks if the player has cleared the level at each frame.
 * If yes, starts the game at the next level.
 * @return {void}
 */
Player.prototype.update = function () {
    if (this.game.isLevelCleared()) {
        this.game.levelUp();
    }
};

/**
 * Defines a callback function to call when the player
 * gains an item.
 * @param {Item} item The item gained by the player.
 * @param {function(Game): void} callback The function to call.
 * @return {void}
 */
Player.prototype.has = function (item, callback) {
    this.gainCallbacks[item] = callback;
};

/**
 * Handles keyscenario events.
 * @param {string} key The pressed key id.
 * @return {void}
 */
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            if (this.x > 0) {
                this.moveTo(this.x - 1, this.y);
            }
            break;
        case 'up':
            if (this.y > 0) {
                this.moveTo(this.x, this.y - 1);
            }
            break;
        case 'right':
            if (this.x < this.game.scenario.width - 1) {
                this.moveTo(this.x + 1, this.y);
            }
            break;
        case 'down':
            if (this.y < this.game.scenario.height - 1) {
                this.moveTo(this.x, this.y + 1);
            }
            break;
        case 'help':
            this.game.helpPlayer();
            break;
        case 'pause':
            if (!this.game.paused) {
                this.game.pause();
            } else {
                this.game.resume();
            }
            break;
        case 'quit':
            this.game.resume(); // Just in case the game was paused before quitting.
            this.game.Selector.isActive = true;
            this.game.restart();
        default:
            break;
    }

};

/**
 * Moves the player to a new position.
 * @param {number} x The new x position.
 * @param {number} y The new y position.
 * @return {void}
 */
Player.prototype.moveTo = function (x, y) {
    if (this.game.paused) {
        return;
    }

    this.x = x;
    this.y = y;

    var item = this.game.scenario.getItem(this.y, this.x);

    // If there is an item at the new position
    if (item != Item.None) {
        if (this.gainCallbacks.hasOwnProperty(item)) {

            // Call its associated callback.
            this.gainCallbacks[item](this.game);
        }

        // Remove the item of the scenario.
        this.game.scenario.removeItem(y, x);
    }
};


/**
 * Selector class.
 * Used to select a character.
 * @constructor
 */
var Selector = function () {
    /**
     * List of characters between which one should be selected.
     * @type {Array.<object>}
     */
    this.allCharacters = null;

    /**
     * The current position of the selector.
     * @type {number}
     */
    this.position = 0;

    /**
     * Whether the selector has focus, then should be
     * rendered on the screen or not.
     * @type {boolean}
     */
    this.isActive = false;

    /**
     * Function to call when a character has been selected.
     * Takes 1 parameter (the selected character).
     * @type {function(object): void}
     */
    this.characterSelectedCallback = function (character) { };
};

/**
 * Defines the function to call on a character has been selected.
 * @param {function(object): void} callback The function to call.
 * @return {void}
 */
Selector.prototype.onCharacterSelected = function (callback) {
    this.characterSelectedCallback = callback;
};

/**
 * Handles keyscenario key pressed events
 * @param {string} key The pressed key id.
 * @return {void}
 */
Selector.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            if (this.position > 0) {
                this.position--;
            }
            break;
        case 'right':
            if (this.position < this.characters.length - 1) {
                this.position++;
            }
            break;
        case 'enter':
            if (this.position >= 0 && this.position <= this.allCharacters.length - 1) {
                this.characterSelectedCallback(this.allCharacters[this.position]);
            }
            break;
        default:
            break;
    }
}
