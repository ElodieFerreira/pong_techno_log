const io = require("socket.io");
const gameBuilder = require("./gameBuilder");
var sockets = io.listen(3000);
let games = new Map();
sockets.on("connection",function(socket){
    socket.on("getRooms",function(){
      var keys = [...games.keys()];
      sockets.emit("rooms",keys);
    })
    socket.on("createRoom",function(name,numberOfPlayers){
        socket.join(name);
        games.set(name,gameBuilder.buildGame(numberOfPlayers));
        games.get(name).numberOfPlayersInRoom++;
        sockets.in(name).emit("requestGameDatas",games.get(name).ball,games.get(name).players,true,games.get(name).numberOfPlayersInRoom)
        //TO DO : Emit when a new Room when is created to updata windows already open.
    })
    socket.on("joinARoom",function(name){
      if(games.get(name).numberOfPlayersInRoom<games.get(name).players.length) {
        socket.join(name);
        games.get(name).numberOfPlayersInRoom++;
        if(games.get(name).players.length==games.get(name).numberOfPlayersInRoom) {
          games.get(name).intervalID = setInterval(mainBall.bind(null,name),15);
        }
        sockets.to(name).emit("requestGameDatas",games.get(name).ball,games.get(name).players,true,games.get(name).numberOfPlayersInRoom);
      } else {
        socket.emit("requestGameDatas","The room is full");
      }
    })
 /*   socket.on("ready",function(index,nameofroom) {
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
     
    });*/
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

