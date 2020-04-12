var game = {
    //general datas
    groundWidth : 700,
    groundHeight : 400,
    groundColor: "#000000",
    netWidth : 6,
    netColor: "#FFFFFF",
    groundLayer : null,
    // datas for scorePlayer
    scorePosPlayer1 : 270,
    scorePosPlayer2 : 395,
    // sound
    wallSound : null,
    colideSound: null,
    // datas for ball
    ball : {
        width : 10,
        height : 10,
        color : "#FFFFFF",
        posX : 200,
        posY : 200,
        directionX: 1,
        directionY: 1,
        speed : 8,
        move : function() {
            this.posX += this.directionX * this.speed;
            this.posY += this.directionY * this.speed;
        },
        bounce : function(soundToPlay) {
            if ( this.posX > game.groundWidth || this.posX < 0 ) {
                this.directionX = -this.directionX;
                //soundToPlay.play()
            }
            if ( this.posY > game.groundHeight || this.posY < 0  ) {
                this.directionY = -this.directionY;
                //soundToPlay.play();
            }
        },
        collide : function(anotherItem) {
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX
                || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY ) ) {
                // Collision
                return true;
            }
            return false;
        },
    },
    //datas for racket
    //player 1
    playerOne : {
        width : 10,
        height : 50,
        color : "#FFFFFF",
        posX : 10,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition: "left",
    },
    //player 2
    playerTwo : {
        width : 10,
        height : 50,
        color : "#FFFFFF",
        posX : 600,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition: "left",
    },
    // socket
    socket: null,
    socket2 : null,

    init : function() {
        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
        this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);
        this.displayScore(0,0);
        this.displayBall();
        this.displayPlayers();
        this.initKeyboard(game.control.onKeyDown,game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        this.wallSound = new Audio("./sound/wall.ogg");
        this.colideSound = new Audio("./sound/collide.ogg");
        game.ai.setPlayerAndBall(this.playerTwo,this.ball);
        this.initConnection();
    },
    //function to connect game
    initConnection : function(){
        this.socket = io.connect('http://localhost:3000/');
        this.socket.on("move",function(data) {
            console.log("444455555577777");
            console.log(data);
            game.playerOne = data;
        })
    },
    //displays function
    displayScore : function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    },

    displayBall : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    displayPlayers : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    },

    moveBall : function(){
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },
    // clear call in order to delete previous trail
    clearLayer : function(targetLayer) {
        targetLayer.clear();
    },
    //control
    initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },

    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },
    // Move
    updatePlayers : function() {
        if ( game.control.controlSystem == "KEYBOARD" ) {
            // keyboard control
            if (game.playerOne.goUp && game.playerOne.posY > 0) {
                this.socket.emit("playerOne",game.playerOne);
            }
            else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
                this.socket.emit("playerOne",game.playerOne);
            }
        } else if ( game.control.controlSystem == "MOUSE" ) {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer) {
                this.socket.emit("playerOne",game.playerOne);
            }
            else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) {
                this.socket.emit("playerOne",game.playerOne);
            }
        }
    },
    movePlayers : function() {
        if ( game.control.controlSystem == "KEYBOARD" ) {
            // keyboard control
            if (game.playerOne.goUp && game.playerOne.posY > 0) {
                game.playerOne.posY-=5;
            }
            else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
                game.playerOne.posY+=5;
            }
        } else if ( game.control.controlSystem == "MOUSE" ) {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer) {
                game.playerOne.posY-=5;
            }
            else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) {
                game.playerOne.posY+=5;
            }
        }
    },

    collideBallWithPlayersAndAction : function() {
        if ( this.ball.collide(game.playerOne) ) {
            game.ball.directionX = -game.ball.directionX;
            //this.colideSound.play()
        }
        if ( this.ball.collide(game.playerTwo) ) {
            game.ball.directionX = -game.ball.directionX;
            //this.colideSound.play()
        }
    },
};
