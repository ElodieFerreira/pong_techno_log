var io = require("socket.io");
var sockets = io.listen(3000);
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
var intervalID = 0;
var game = { control: { controlSystem :"KEYBOARD"}};
sockets.on('connection', function (socket) {
    socket.on('updateMove', function (data) {
        for(let item in data) {
          players[item].goUp = data[item].goUp;
          players[item].goDown = data[item].goDown;
        } 
        sockets.emit("move",players);
    });
    socket.on('score',function(score1,score2){
        players[0].score=score1;
        players[1].score=score2;
        sockets.emit('score',score1,score2);
    });
    socket.on("ready",function(index) {
      //noting
      players[index].ready=true;
      readyToStart=true;
      for(let index in players) {
        if(!players[index].ready) readyToStart=false;
      }
      if(readyToStart) intervalID = setInterval(mainBall,20);
      
    });
    socket.on("requestGameDatas",function(){
      sockets.emit("requestGameDatas",ball,players);
    })
});

var ball = {
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
var moveTools= {
    moveBall: function(ball){
    ball.move();
    ball.bounce(this.wallSound);
  },
    collideBallWithPlayersAndAction : function(ball) { 
    if ( ball.collide(players[0]) || ball.collide(players[2]) ) {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
    if ( ball.collide(players[1]) || ball.collide(players[3]) )  {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
  },
  movePlayers : function() {
    for(let index in players) {
      moveTools.movePlayer(players[index]);
    }
  },
  // Move a player
    movePlayer : function(player) {
    if ( game.control.controlSystem == "KEYBOARD" ) {
    // keyboard control
      if (player.goUp && player.posY > 0) {
        player.posY-=7;
      }
      else if (player.goDown && player.posY < 400 - player.height) {
        player.posY+=7;
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
}

mainBall = function(){
      moveTools.movePlayers();
      moveTools.moveBall(ball);
      moveTools.collideBallWithPlayersAndAction(ball)
      sockets.emit("ball",ball,players);
}

