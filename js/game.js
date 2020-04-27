var game = {
	//general datas
	groundWidth : 700,
	groundHeight : 400,
	groundColor: "#000000",
	netWidth : 6,
	netColor: "#FFFFFF",
	groundLayer : null,
	nameRoom:null,
	// datas for scorePlayer
	scorePosPlayer1 : 270,
	scorePosPlayer2 : 395,
	isWinned: false,
  	// datas for ball
	ball : null,
	players : [],
	mainPlayer : null,
	// socket
	socket: null,
    requestRooms: function() {
      this.socket = io.connect('http://localhost:3000/');
      // this.socket.emit("requestGameDatas");
      this.socket.emit("getRooms");
	  this.socket.once("rooms",function(rooms){
	  		console.log(rooms);
      		game.display.displayRooms(rooms);
      	});
	  subcribeGameDatas= function(){game.socket.once("requestGameDatas",function(ball,players,isNumberOfPlayerSet,mainPlayerNumber){
        console.log(typeof ball);
        if(typeof ball!="string") {
        		game.ball=ball;
        		game.players=players;
        		game.init()
        		game.mainPlayer=mainPlayerNumber-1;
        		game.control.currentPlayer=mainPlayerNumber-1;
       			game.display.deleteForm();
        } else {
        	game.display.displayError(ball);
        	abonnement();
        }
      });
  	}
  	  subcribeGameDatas();
	  game.initConnection();
    },
    init : function() {
    	this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
    	game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    	this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    	this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  
    	this.displayScore(this.players[0].score,this.players[1].score);
    	this.displayBall();
    	this.displayPlayers();
    	this.initKeyboard(game.control.onKeyDown,game.control.onKeyUp);
	},
	choosePlayer: function(){
		var numberOfPlayer = document.querySelector('input[name="numberOfPlayer"]:checked').value;
		game.nameRoom = document.getElementById("nameRoom").value;
		this.socket.emit("createRoom",game.nameRoom,parseInt(numberOfPlayer))
	},
	//Affichage des scores
	score : function(){
		if(game.ball.posX <= -3){
			this.players[1].score += 1;
			this.socket.emit('scoreUpdated',this.players[0].score,this.players[1].score,game.nameRoom);
			return true;
		  }
		  else if(game.ball.posX >= 700){
			this.players[0].score += 1;
			this.socket.emit('scoreUpdated',this.players[0].score,this.players[1].score,game.nameRoom);
			return true;
		}
		  return false;
	 },
	//function to connect game
	initConnection : function(){
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
		game.players[0].score = score1;
		game.players[1].score = score2;
		//console.log("player1 : "+game.playerOne.score+"Player2 : "+game.playerTwo.score);
		game.clearLayer(game.scoreLayer);
		game.displayScore(game.players[0].score,game.players[1].score);
	});
	this.socket.on("win",function(data){
			game.isWinned = true;
			game.display.drawTextInLayer(game.scoreLayer,"The team "+data+" winned !","60px Arial", "#FFFFFF", 90, 320)
	});
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
