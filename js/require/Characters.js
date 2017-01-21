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
