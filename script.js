window.addEventListener("load", function () {
    //Initialize width & height
    const WIDTH = 640;
    const HEIGHT = 360;

    //Making game live
    var gameLive = true;

    //Initialize level
    var level = 1;
    var life = 5;

    //Random color
    var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

    //Initialize enemies
    var enemies = [
        {
            x: 100,  //x-coordinate
            y: 100,  //y-coordinate
            speedY: 2,
            w: 40,   //Width of enemy-1
            h: 40    //Height of enemy-1
        },
        {
            x: 200,
            y: 0,
            speedY: 2,
            w: 40,
            h: 40
        },
        {
            x: 330,
            y: 100,
            speedY: 3,
            w: 40,
            h: 40
        },
        {
            x: 450,
            y: 100,
            speedY: -3,
            w: 40,
            h: 40
        }
    ];

    //Initialize player
    var player = {
        x: 10,
        y: 160,
        w: 40,
        h: 40,
        isMoving: false,
        speedX: 2
    }

    //Initialize goal
    var goal = {
        x: 580,
        y: 160,
        w: 50,
        h: 36
    }

    var sprites = {};

    var movePlayer = function () {
        player.isMoving = true
    }

    var stopPlayer = function () {
        player.isMoving = false
    }

    //Selecting the canvas 
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");

    //Adding event listener
    canvas.addEventListener("mousedown", movePlayer);
    canvas.addEventListener("mouseup", stopPlayer);
    canvas.addEventListener("touchstart", movePlayer);
    canvas.addEventListener("touchend", stopPlayer);

    //Update the logic
    var update = function () {
        //Check if player wons
        if (checkCollision(player, goal)) {
            alert("Win!!");
            level += 1;
            life += 1;
            player.speedX += 1;
            player.x = 10;
            player.y = 160;
            player.isMoving = false;

            //Loop
            for (var ab = 0; ab < enemies.length; ab++) {
                if (enemies[ab].speedY > 1) {
                    enemies[ab].speedY += 1;
                }
                else {
                    enemies[ab].speedY -= 1;
                }
            }
        }

        //Update player
        if (player.isMoving) {
            player.x = player.x + player.speedX;
        }

        //Update enemies
        var i = 0;
        var n = enemies.length;

        enemies.forEach(function (element, index) {
            //Checking collision with player
            if (checkCollision(player, element)) {
                //Stop game
                if (life === 0) {
                    alert("Game Over!!!")
                    //Loop
                    for (var ab = 0; ab < enemies.length; ab++) {
                        if (enemies[ab].speedY > 1) {
                            enemies[ab].speedY -= (level - 1)
                        }
                        else {
                            enemies[ab].speedY += (level - 1)
                        }
                    }

                    level = 1;
                    life = 6;
                    player.speedX = 2;
                    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                }

                if (life > 0) {
                    life -= 1;
                    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                }

                player.x = 10;
                player.y = 160;
                player.isMoving = false;
            }

            //Move enemy
            element.y += element.speedY;

            //Check borders
            if (element.y <= 10) {
                element.y = 10;
                element.speedY *= -1;
            }
            else if (element.y >= HEIGHT - 50) {
                element.y = HEIGHT - 50;
                element.speedY *= -1;
            }
        })
    }

    //Draw the elements
    var draw = function () {
        //Clear the canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        //Draw
        ctx.font = '15px Verdana';
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText("Level : " + level, 10, 15)
        ctx.fillText("Life : " + life, 10, 35)
        ctx.fillText("Speed : " + player.speedX, 10, 55)

        //Draw player with random color
        ctx.fillStyle = "rgb(0,255,128)";
        ctx.fillRect(player.x, player.y, player.w, player.h)

        //Draw enemies
        ctx.fillStyle = color;
        enemies.forEach(function (element, index) {
            ctx.fillRect(element.x, element.y, element.w, element.h)
        })

        //Draw goal
        ctx.fillStyle = "rgb(0,255,128)";
        ctx.fillRect(goal.x, goal.y, goal.w, goal.h)
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("Goal", goal.x + 7, goal.y + 25)
    };

    //Step function -- executed multiple times per second
    var step = function () {
        update();
        draw();

        if (gameLive) {
            window.requestAnimationFrame(step);
        }
    };

    //Checking Collision between two rects
    var checkCollision = function (rect1, rect2) {
        var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
        var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);

        return closeOnWidth && closeOnHeight;
    }

    step();
});