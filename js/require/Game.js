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
    player.has(Item.Heart, function(player) {
        player.health++;
    });

    /**
     *@method -- if player gets a star
     *	 he is inviincible for 1,5 seconds
     */
    player.has(Item.Star, function(player) {
        player.isHero = true;
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
    player.has(Item.Rock, funtion(game) {
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
    this.healthDamageCallBack = function(player.health) {};
    this.healthHealCallBack = function(player.health) {};
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
