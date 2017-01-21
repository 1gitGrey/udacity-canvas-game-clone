/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        seconds,
        timer;




    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (!game.paused) {
            update(dt);
            render();
        }
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

        win.requestAnimationFrame(main);

    }
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
    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        reset();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkPickups();
        checkGameStatus();
        // checkCollisions();
    }

    function checkCollisions() {
        for (var i = 0; i < allEnemies.length; i++) {
            if (Math.abs(player.x - allEnemies[i].x) < 50 && Math.abs(player.y - allEnemies[i].y) < 50) {
                // If player is hit, reset player position.
                player.reset();
                if (player.health > 0) {
                    // If player's life is more than 0, subtract one life.
                    health.hurt();
                    // Update life.

                };
            };
        };
    };

    function checkPickups() {
        if (Math.abs(player.x - item.x) < 50 && Math.abs(player.y - item.y) < 50) {
            switch (item.sprite) {
                case 'images/Heart.png':
                    health.heal();
                    item.reset();
                    break;
                case 'images/Star.png':
                    3 * health.heal();
                    item.reset();
                    break;
                case 'images/Key.png':
                    item.reset();
                    break;
                case 'images/Gem-orange.png':
                    item.reset();
                    break;
                case 'images/Gem-blue.png':
                    item.reset();
                    break;
                case 'images/Gem-green.png':
                    item.reset();
                    break;
                default:
                    return;
            }

        }
    }

    function checkGameStatus() {



        if (player.isDead) {
            game.stop = true;
            game.gameOver();
        }
    }

    /* This is called b
    y the update function and loops through all of the
         * objects within your allEnemies array as defined in app.js and calls
         * their update() methods. It will then call the update function for your
         * player object. These update methods should focus purely on updating
         * the data/properties related to the object. Do your drawing in your
         * render methods.
         */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allItems.forEach(function(item) {
            item.update(dt);
        })
        player.update();
        health.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        if (game.selectChar.isActive) {
            renderSelectChar();
        } else {
            renderScenario();
        }
    }

    function renderScenario() {

        var Images = {};

        Images[Component.Water] = 'images/water-block.png',
            Images[Component.Stone] = 'images/stone-block.png',
            Images[Component.Grass] = 'images/grass-block.png',

            Images[Item.BlueGem] = 'images/gem-block.png',
            Images[Item.GreenGem] = 'images/gem-block.png',
            Images[Item.OrangeGem] = 'images/gem-block.png',
            Images[Item.Key] = 'images/gem-block.png',
            Images[Item.Heart] = 'images/water-block.png',
            Images[Item.Star] = 'images/water-block.png',
            Images[Item.Rock] = 'images/water-block.png',

            for (var row = 0; row < ctx.canvas.height; row++) {
                for (var col = 0; col < ctx.canvas.width; col++) {

                    var component = game.scenario.getComponent(row, col);
                    var item = game.scenario.getItem(row, col);

                    if (row === 0) {
                        ctx.clearRect(col * 101, row * 83, 101, 171);
                    }

                    ctx.drawImage(Resources.get(Images[component], col * 101, row * 83));

                    if (item != Item.None) {
                        ctx.drawImage(Resources.get(Images[item]), col * 101, row * 83);
                    }
                }
            }
        renderEntities();
    }

    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     *
    var rowImages = [
            'images/water-block.png', // Top row is water
            'images/stone-block.png', // Row 1 of 4 of stone
            'images/stone-block.png', // Row 2 of 4 of stone
            'images/stone-block.png', // Row 3 of 4 of stone
            'images/stone-block.png', // Row 4 of 4 of stone
            'images/grass-block.png', // Row 1 of 2 of grass
            'images/grass-block.png' // Row 2 of 2 of grasss
        ],
        numRows = 7,
        numCols = 9,
        row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     *
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             *
            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        }
    }

    renderEntities();
}

/* This function is called by the render function and is called on each game
 * tick. Its purpose is to then call the render functions you have defined
 * on your enemy and player entities within app.js
 */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        game.allItems.forEach(function(item) {
            item.render();
        })
        game.player.render();
        //game.render();
        //health.render();
    }

    function renderSelectChar() {

        $('#selectChar-header').css('display', 'block');

        var selectorImage = 'images/selector.png'

        var allCharacters = game.selectChar.allCharacters;


        canvas.width = (allCharacters.length * 101) + 40;
        canvas.height = 200;

        ctx.drawImage(Resources.get(selectorImage), game.selectChar.position * 101, 0)


        for (var i = 0; i < allCharacters.length; i++) {
            ctx.drawImage(Resources.get(allCharacters[i].sprite), i * 101, 0);
        }

    }

    function checkCollisions() {
        if (game.player.wasMyDudeHit() || game.player.didMyDudeDrown()) {
            game.player.reset();
        }
    }


    function restart() {

        game.restart();
    }


    function initGame(game) {
        initSelectChar(game);
        game.player.healthDamageCallBack(function(health) {
            $('.health').text(health);
        });

        game.player.healthHealCallBack(function(health) {
            $('.health').text(health);
        });

        game.
    }
    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        var displayElements = ['timer', 'life', 'score', 'tryagain', 'game-board'];
        var undisplayElements = ['instruction', 'start', 'header'];


        startbutton.onclick = function() {
            document.getElementById('instructions').classList.add('hide');
            startbutton.classList.add('hide');
            document.getElementById('canvas').classList.remove('hide');
            document.body.classList.add('start');
            document.getElementById('title').classList.add('titleStart');
            document.getElementById('timer').style.display = 'inline-block';



            main();
            startTimer(60, game);


        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/Heart.png',
        'images/Star.png',
        'images/Selector.png',
        'images/Key.png',
        'images/Gem-blue.png',
        'images/Gem-green.png',
        'images/health.png',
        'images/Gem-orange.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png',
        'images/char-pink-girl.png',
        'images/char-cat-girl.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
