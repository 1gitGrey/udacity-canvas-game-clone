var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        animate = true,
        game = new Game();


    initializeGame(game);

    canvas.width = 909;
    canvas.height = 707;
    doc.getElementById('game-area').appendChild(canvas);

    /**
     * Sets up the game loop.
     * @return {void}
     */
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        if (animate) {
            win.requestAnimationFrame(main);
        }
    };

    /**
     * Starts the game and enters the game loop.
     * @return {void}
     */
    function init() {

        restart();
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
        var Images = { };

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

        for (var row = 0; row < game.scenario.height; ++row) {
            for (var col = 0; col < game.scenario.width; ++col) {
                var component = game.scenario.getComponent(row, col);
                var item = game.scenario.getItem(row, col);

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
        $('#hub').css('visibility', 'hidden');

        $('#char-selector-header').css('display', 'block');

        var selectorImage = 'images/selector.png';

        var characters = game.characterSelector.characters;

        canvas.width = characters.length * 101;
        canvas.height = 171;

        ctx.drawImage(Resources.get(selectorImage), game.characterSelector.position * 101, 0);

        for (var i = 0; i < characters.length; ++i) {
            ctx.drawImage(Resources.get(characters[i].sprite), i * 101, 0);
        }
    }

    /**
     * Checks if the player was hit or is on a water component.
     * @return {void}
     */
    function checkCollisions() {
        if (game.wasPlayerHit() || game.isPlayerDrowning()) {
            game.reset();
        }
    }

    /**
     * Restarts the game at the first level.
     * @return {void}
     */
    function restart() {
        game.restart();
    }


    /**
     * Initializes the game and setup in-game events
     * handlers.
     * @return {void}
     */
    function initializeGame(game) {
        initializeCharacterSelector(game);

        game.onLifeLost(function (lives) {
            $('.lives').text(lives);
        });

        game.onLifeGained(function (lives) {
            $('.lives').text(lives);
        });

        game.onLevelCleared(function (nextLevel) {
            clearCanvas();

            $('.level').text(nextLevel + 1);
        });

        game.onGameOver(function (game) {
            animate = false;

            $('#game-area').css('display', 'none');
            $('#game-over').css('display', 'component');

            $('#restart').click(function () {
                animate = true;

                init();

                $('#game-over').css('display', 'none');
                $('#game-area').css('display', 'component');
            });
        });

        game.onGameRestart(function (game) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            game.characterSelector.hasFocus = true;
        });

        game.onGameCompleted(function (game) {
            animate = false;

            $('#game-area').css('display', 'none');
            $('#congratulations').css('display', 'component');

            $('#play').click(function () {
                animate = true;

                init();

                $('#congratulations').css('display', 'none');
                $('#game-area').css('display', 'component');
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
    function initializeCharacterSelector(game) {
        var characters = [
            {name: 'boy', sprite: 'images/char-boy.png'},
            {name: 'cat-girl', sprite: 'images/char-cat-girl.png'},
            {name: 'horn-girl', sprite: 'images/char-horn-girl.png'},
            {name: 'pink-girl', sprite: 'images/char-pink-girl.png'},
            {name: 'princess-girl', sprite: 'images/char-princess-girl.png'}
        ];

        game.characterSelector.characters = characters;

        game.characterSelector.onCharacterSelected(function (character) {
            clearCanvas();

            game.player.sprite = character.sprite;

            $('#char-selector-header').css('display', 'none');
            $('#hub').css('visibility', 'visible');

            game.characterSelector.hasFocus = false;
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
        'images/char-cat-girl-star.png',
        'images/char-horn-girl.png',
        'images/char-horn-girl-star.png',
        'images/char-pink-girl.png',
        'images/char-pink-girl-star.png',
        'images/char-princess-girl.png',
        'images/char-princess-girl-star.png',
        'images/selector.png'
    ]);

    Resources.onReady(init);

    global.ctx = ctx;
})(this);
