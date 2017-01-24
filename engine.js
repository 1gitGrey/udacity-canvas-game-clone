const Engine = (function(global) {
    const doc = global.document;
    const win= global.window;
    let    canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        seconds,
        timer;
      //  animate = true,
        game = new Game();


    bootstrap(game);

    canvas.width = 909;
    canvas.height = 707;
    doc.getElementById('canvas-holder').appendChild(canvas);

    /**
     *  MAIN --> creates loop
     */
    function main() {
        let now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        if (!game.paused) {
            win.requestAnimationFrame(main);
        }
    };
    /**
     * Sets a timer for the game.
     * @param {number} time Total seconds of the timer
     * @param {Game} game The new game instance
     * @return {void}
     */
    function startTimer(time, game) {
        timer = doc.getElementById('timer');
        seconds = time;
        // If out of time, game over.
        // Set game's stop value to true.
        if (seconds === 0) {
            game.gameOver();
            game.stop = true;
        };
        // If game's stop value is false, update timer and continue the game.
        if (!game.stop) {
            if (!game.paused) {
                seconds--;
                updateTimer();
            }
            win.setTimeout(function() {
                startTimer(seconds, game);
            }, 1000);
        };
    };
    /**
     * Updates the timer each second.
     * @return {void}
     */
    function updateTimer() {
        var timerStr;
        var tempSeconds = seconds;
        var tempMinutes = Math.floor(seconds / 60) % 60;
        tempSeconds -= tempMinutes * 60;
        timerStr = formatTimer(tempMinutes, tempSeconds);
        timer.innerHTML = timerStr;
    };
    /**
     * Format timer string displayed in the game.
     * @param {number} minutes Remaining minutes of the timer
     * @param {number} seconds Ramaining seconds of the timer
     * @return {string}
     */
    function formatTimer(minutes, seconds) {
        var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
        var formattedSeconds = (seconds < 10) ? '0' + seconds : seconds;

        return formattedMinutes + ":" + formattedSeconds;
    };
    /**
     * Starts the game and enters the game loop.
     * @return {void}
     */
    function init() {

      //  restart();
        lastTime = Date.now();
        main();
    }

    /**
     * Updates the game at each frame.
     * @param {number} dt The elapsed time since the last update.
     * @return {void}
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /**
     * Updates the position of the entities at each frame.
     * @param {number} The elapsed time since the last update.
     * @return {void}
     */
    function updateEntities(dt) {
        game.allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
      /*  allItems.forEach(function(item) {
            item.update(dt);
  */
        game.player.update();
    }

    /**
     * Dislays the entire game on the screen.
     * @return {void}
     */
    function render() {
        if (game.selector.isActive) {
            renderSelector();
        } else {
            renderGame();
        }
    }

    // called by render()
    function renderGame() {
        let Images = { };

        Images[Component.Water] = 'images/water-component.png';
        Images[Component.Stone] = 'images/stone-component.png';
        Images[Component.Grass] = 'images/grass-component.png';

        Images[Item.BlueGem] = 'images/gem-blue.png';
        Images[Item.GreenGem] = 'images/gem-green.png';
        Images[Item.OrangeGem] = 'images/gem-orange.png';
        Images[Item.Heart] = 'images/heart.png';
        Images[Item.Key] = 'images/key.png';
        Images[Item.Star] = 'images/star.png';
        Images[Item.Rock] = 'images/rock.png';

        for (let row = 0; row < game.scenario.height; ++row) {
            for (let col = 0; col < game.scenario.width; ++col) {
                let component = game.scenario.getComponent(row, col);
                let item = game.scenario.getItem(row, col);

                if (row === 0) { // Clear the top row of the scenario to remove any previous frame's remaining pixel.
                    ctx.clearRect(col * 101, row * 83, 101, 171);
                }

                ctx.drawImage(Resources.get(Images[component]), col * 101, row * 83);

                if (item != Item.None) {
                    ctx.drawImage(Resources.get(Images[item]), col * 101, row * 83);
                }
            }
        }

        renderEntities();
    }

    /**
     * Displays the player and allEnemies on the screen.
     * @return {void}
     */
    function renderEntities() {
        game.allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        game.player.render();
    }

    /**
     * Displays the character selector on the screen.
     * @return {void}
     */
    function renderSelector() {
        // The hub should not be visible when the character selector is visible.
        $('#main').css('visibility', 'hidden');

        $('#selection-header').css('display', 'block');

        let selectorImage = 'images/selector.png';

        let allCharacters = game.selector.allCharacters;

        canvas.width = (allCharacters.length * 101) + 40;
        canvas.height = 171;

        ctx.drawImage(Resources.get(selectorImage), game.selector.position * 101, 0);

        for (let i = 0; i < allCharacters.length; ++i) {
            ctx.drawImage(Resources.get(allCharacters[i].sprite), i * 101, 0);
        }
    }

    /**
     * Checks if the player was hit or is on a water component.
     * @return {void}
     */
    function checkCollisions() {
/*        if (game.wasPlayerHit() || game.isPlayerDrowning()) {
            game.reset();
        }
        */

        for (var i = 0; i < allEnemies.length; i++) {
            if (Math.abs(game.player.x - allEnemies[i].x) < 50 && Math.abs(game.player.y - allEnemies[i].y) < 50) {
                // If player is hit, reset player position.
                game.player.reset();
                if (game.player.health > 0) {
                    // If player's life is more than 0, subtract one life.
                    game.player.health.hurt();
                    // Update life.

                };
            };
        };
    }

    /**
     * Restarts the game at the first level.
     * @return {void}
    function restart() {
        game.restart();
    }
*/

    /**
     * Initializes the game and setup in-game events
     * handlers.
     * @return {void}
     */
    function bootstrap(game) {
        getCharacter(game);

        game.onLifeLost(function (lives) {
            $('#health').text(health);
        });

        game.onLifeGained(function (lives) {
            $('#health').text(health);
        });

        game.onLevelCleared(function (nextLevel) {
            clearCanvas();

            $('.level').text(nextLevel + 1);
        });

        game.onGameOver(function (game) {
            //animate = false;
            game.paused = true;

            $('#canvas-holder').css('display', 'none');
            $('#game-over').css('display', 'component');

            $('#restart').click(function () {
                animate = true;

                init();

                $('#game-over').css('display', 'none');
                $('#canvas-holder').css('display', 'block');
            });
        });

        game.onGameRestart(function (game) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            game.selector.isActive = true;
        });

        game.onGameCompleted(function (game) {
            animate = false;

            $('#canvas-holder').css('display', 'none');
            $('#congratulations').css('display', 'component');

            $('#play').click(function () {
                animate = true;

                init();

                $('#congratulations').css('display', 'none');
                $('#canvas-holder').css('display', 'component');
            })
        });

        game.onGamePaused(function (game) {
            animate = false;
        });

        game.onGameResumed(function (game) {
            animate = true;

            lastTime = Date.now();
            main();
        });
    }

    /**
     * Sets up the playable characters of the game
     * and initializes the character selector.
     * @param {Game} game The current game.
     * @return {void}
     */
    function getCharacter(game) {
        let allCharacters = [
            {name: 'boy', sprite: 'images/char-boy.png'},
            {name: 'cat-girl', sprite: 'images/char-cat-girl.png'},
            {name: 'horn-girl', sprite: 'images/char-horn-girl.png'},
            {name: 'pink-girl', sprite: 'images/char-pink-girl.png'},
            {name: 'princess-girl', sprite: 'images/char-princess-girl.png'}
        ];

        game.selector.allCharacters = allCharacters;

        game.selector.onCharacterSelected(function (character) {
            clearCanvas();

            game.player.sprite = character.sprite;

            $('#selection-header').css('display', 'none');
            $('#main').css('visibility', 'visible');

            game.selector.isActive  = false;
        });
    }

    /**
     * Erases everything on the canvas.
     * @return {void}
     */
    function clearCanvas() {
        canvas.width = game.scenario.width * 101;
        canvas.height = game.scenario.height * 101 + 101;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    Resources.load([
        'images/stone-component.png',
        'images/water-component.png',
        'images/grass-component.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/gem-orange.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/heart.png',
        'images/star.png',
        'images/key.png',
        'images/rock.png',
        'images/char-boy.png',
        'images/char-boy-star.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/selector.png'
    ]);

    Resources.onReady(init);

    global.ctx = ctx;
})(this);
