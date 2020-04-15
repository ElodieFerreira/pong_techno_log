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
      id:1,
  		width : 10,
  		height : 50,
  		color : "#FFFFFF",
  		posX : 75,
  		posY : 200,
  		goUp : false,
  		goDown : false,
		originalPosition: "left",
		score : 0,
  	},
    //player 2
    playerTwo : {
      id:2,
    	width : 10,
    	height : 50,
    	color : "#FFFFFF",
    	posX : 600,
    	posY : 200,
    	goUp : false,
    	goDown : false,	
		originalPosition: "left",
		score : 0,
	},
  players : [],
	//On choisi le 
	//main player
	mainPlayer : null,
	setMainPlayer : function(){
		var myselect = document.getElementById("choixPlayer");
		this.mainPlayer = myselect.options[myselect.selectedIndex].value;
    game.control.currentPlayer = parseInt(this.mainPlayer)-1;
    this.initConnection()
    game.socket.emit("updateMove",game.players);
  	},
	// socket
	socket: null,

    init : function() {
    	this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
    	game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    	this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    	this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  
    	this.displayScore(this.playerOne.score,this.playerTwo.score);
    	this.displayBall();
    	this.displayPlayers();
    	this.initKeyboard(game.control.onKeyDown,game.control.onKeyUp);
    	this.initMouse(game.control.onMouseMove);
    	this.wallSound = new Audio("./sound/wall.ogg");
    	this.colideSound = new Audio("./sound/collide.ogg");
      game.players[0] = game.playerOne;
      game.players[1] = game.playerTwo;
	},
	//Affichage des scores
	score : function(){
		if(game.ball.posX <= -3){
			this.playerTwo.score += 1;
			this.socket.emit('score',this.playerOne.score,this.playerTwo.score);
			//this.clearLayer(this.scoreLayer);
			//this.displayScore(this.playerOne.score,this.playerTwo.score);
			return true;
		  }
		  else if(game.ball.posX >= 700){
			this.playerOne.score += 1;
			this.socket.emit('score',this.playerOne.score,this.playerTwo.score);
			//this.clearLayer(this.scoreLayer);
			//this.displayScore(this.playerOne.score,this.playerTwo.score);
			return true;
		}
		  return false;
	 },
	//function to connect game
	initConnection : function(){
		this.socket = io.connect('http://localhost:3000/');
    this.socket.on("move",function(data) {
      for(let item in data) {
		game.players[item]= data[item];
	  }
    game.clearLayer(game.playersBallLayer);
    // game.movePlayers();
    game.displayPlayers();
    game.displayBall();
    });
    this.socket.on("ball",function(ball,players){
      game.ball=ball;
      game.players=players;
    game.clearLayer(game.playersBallLayer);
    // game.movePlayers();
    game.displayPlayers();
    game.displayBall();
	});
	//gestion des score en socket
	this.socket.on('score',function(score1,score2){
		//console.log("player1 : "+score1+"Player2 : "+score2);
		game.playerOne.score = score1;
		game.playerTwo.score = score2;
		//console.log("player1 : "+game.playerOne.score+"Player2 : "+game.playerTwo.score);
		game.clearLayer(game.scoreLayer);
		game.displayScore(game.playerOne.score,game.playerTwo.score);
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
    for(let playerIndex in game.players) {
        player = game.players[playerIndex];
        game.display.drawRectangleInLayer(this.playersBallLayer, player.width, player.height, player.color, player.posX, player.posY);
    }
		
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
	movePlayers : function() {
    game.movePlayer(game.players[0]);
    game.movePlayer(game.players[1]);
	},
  // Move a player
    movePlayer : function(player) {
		if ( game.control.controlSystem == "KEYBOARD" ) {
		// keyboard control
			if (player.goUp && player.posY > 0) {
				player.posY-=5;
			}
			else if (player.goDown && player.posY < game.groundHeight - player.height) {
				player.posY+=5;
			} else if ( game.control.controlSystem == "MOUSE" ) {
				//mouse control
				if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer) {
				player.posY-=5;
				} else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) {
					player.posY+=5;
				}
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
