// class to Build a game
class gameBuilder {
	static buildGame(numberOfPlayers,portGame) {
		gameToSend= {
			players: [],
			ball: null,
			port: null,
		}
		for(let i=0,i<numberOfPlayers,i++){
			players[i]=gameToSend.players[i];
		}
		gameToSend.ball = getBallAtInitialisation();
		gameToSend.port = portGame;
		return gameToSend;
	}

	
	getBallAtInitialisation(){
	return {
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
        if ( this.posX > 700 || this.posX < 0 ) {
          this.directionX = -this.directionX;
          //soundToPlay.play()
        }
        if ( this.posY > 400 || this.posY < 0  ) {
          this.directionY = -this.directionY;    
          //soundToPlay.play();  
        }
      },
      collide : function(anotherItem) {
            if(typeof anotherItem !== "undefined")
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX
              || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY ) ) {
        // Collision
            return true;
            } 
          return false;
        },
	};
	}
}
var game_model = {
	players: [],
	ball: null,
	port: null,
}
var players = [];
players[0]= {  id:1,
      ready : false,
      width : 10,
      height : 50,
      color : "#FFFFFF",
      posX : 75,
      posY : 200,
      goUp : false,
      goDown : false,
    originalPosition: "left",
    score : 0,};
players[1]= {
      id:2,
      ready : false,
      width : 10,
      height : 50,
      color : "#FFFFFF",
      posX : 600,
      posY : 200,
      goUp : false,
      goDown : false, 
    originalPosition: "left",
    score : 0,}
players[2]= {  id:1,
      width : 10,
      height : 50,
      color : "#FFFFFF",
      posX : 75,
      posY : 100,
      goUp : false,
      goDown : false,
    originalPosition: "left",
    score : 0,};

players[3]= {
      id:2,
      width : 10,
      height : 50,
      color : "#FFFFFF",
      posX : 600,
      posY : 100,
      goUp : false,
      goDown : false, 
    originalPosition: "left",
    score : 0,}



module.exports = gameBuilder;