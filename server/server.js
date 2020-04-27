const io = require("socket.io");
const gameBuilder = require("./gameBuilder");
var sockets = io.listen(3000);
optional_players = [];
var players = [];
players[0]= {  id:1,
      ready : false,
      width : 10,
      height : 60,
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
      height : 60,
      color : "#FFFFFF",
      posX : 600,
      posY : 200,
      goUp : false,
      goDown : false, 
    originalPosition: "left",
    score : 0,}
optional_players[0]= {  id:1,
      width : 10,
      height : 60,
      color : "#FFFFFF",
      posX : 125,
      posY : 100,
      goUp : false,
      goDown : false,
    originalPosition: "left",
    score : 0,};

optional_players[1]= {
      id:2,
      width : 10,
      height : 60,
      color : "#FFFFFF",
      posX : 550,
      posY : 100,
      goUp : false,
      goDown : false, 
      originalPosition: "left",
      score : 0,}
var intervalID = 0;
var numberIsSet = false;
var gameIsStarted = false;
let games = new Map();
sockets.on("connection",function(socket){
    socket.on("getRooms",function(){
      var keys = [...games.keys()];
      sockets.emit("rooms",keys);
    })
    socket.on("createRoom",function(name,numberOfPlayers){
        console.log(name);
        socket.join(name);
        games.set(name,gameBuilder.buildGame(numberOfPlayers));
        sockets.in(name).emit("requestGameDatas",games.get(name).ball,games.get(name).players,true)
        //TO DO : Emit when a new Room when is created to updata windows already open.
    })
    socket.on("joinARoom",function(name){
      socket.join(name);
      sockets.to(name).emit("requestGameDatas",games.get(name).ball,games.get(name).players,true)
    })
    socket.on("ready",function(index,nameofroom) {
      //noting
      games.get(nameofroom).players[index].ready=true;
      games.get(nameofroom).readyToStart=true;
      for(let index in games.get(nameofroom).players) {
        if(!games.get(nameofroom).players[index].ready) games.get(nameofroom).readyToStart=false;
      }
      if(games.get(nameofroom).readyToStart&&!games.get(nameofroom).gameIsStarted) {
          games.get(nameofroom).intervalID = setInterval(mainBall.bind(null,nameofroom),15);
          games.get(nameofroom).gameIsStarted = true;
      }      
    });
    socket.on('updateMove', function (players,nameofroom) {
        for(let index in players) {
          games.get(nameofroom).players[index].goUp = players[index].goUp;
          games.get(nameofroom).players[index].goDown = players[index].goDown;
        } 
        sockets.in(nameofroom).emit("move",games.get(nameofroom).players);
    });
    socket.on('scoreUpdated',function(score1,score2,nameofroom){
        games.get(nameofroom).players[0].score=score1;
        games.get(nameofroom).players[1].score=score2;
        sockets.in(nameofroom).emit('score',score1,score2);
        if(games.get(nameofroom).players[0].score>=10) {
          sockets.emit("win",1);
          clearInterval(games.get(nameofroom).intervalID);
        } else if (games.get(nameofroom).players[1].score>=10){
          sockets.emit("win",2);
          clearInterval(games.get(nameofroom).intervalID);
        }
    });
});
/*sockets.on('connection', function (socket) {
    socket.on('score',function(score1,score2){
        players[0].score=score1;
        players[1].score=score2;
        sockets.emit('score',score1,score2);
        if(players[0].score>=10) {
          sockets.emit("win",1);
          clearInterval(intervalID);
        } else if (players[1].score>=10){
          sockets.emit("win",2);
          clearInterval(intervalID);
        }
    });
    socket.on("requestGameDatas",function(){
      console.log(numberIsSet);
      sockets.emit("requestGameDatas",ball,players,numberIsSet);
    })
    socket.on("numberOfPlayer",function(numberOfPlayer){
      if(numberOfPlayer!=2){
        players[2]=optional_players[0];
        players[3]=optional_players[1];
      }
      numberIsSet = true;
      sockets.emit("updateNumbersOfPlayers");
    })
});
*/
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
    collideBallWithPlayersAndAction : function(ball,players) { 
    if ( ball.collide(players[0]) || ball.collide(players[2]) ) {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
    if ( ball.collide(players[1]) || ball.collide(players[3]) )  {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
  },
  movePlayers : function(nameofroom) {
    for(let index in games.get(nameofroom).players) {
      moveTools.movePlayer(games.get(nameofroom).players[index]);
    }
  },
  // Move a player
    movePlayer : function(player) {
    // keyboard control
      if (player.goUp && player.posY > 0) {
        player.posY-=7;
      }
      else if (player.goDown && player.posY < 400 - player.height) {
        player.posY+=7;
      } 
    },
}

mainBall = function(nameofroom){
      moveTools.movePlayers(nameofroom);
      moveTools.moveBall(games.get(nameofroom).ball);
      moveTools.collideBallWithPlayersAndAction(games.get(nameofroom).ball,games.get(nameofroom).players)
      sockets.in(nameofroom).emit("ball",games.get(nameofroom).ball,games.get(nameofroom).players);
}

