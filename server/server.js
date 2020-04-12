var io = require("socket.io");
var sockets = io.listen(3000);
//var sockets2 = io.listen(4000);
sockets.on('connection', function (socket) {
    socket.on('playerOne', function (data) {
        // faire ce qu'il y a à faire
        // if(data.source=="player1") {
        //     console.log("player1");
        //     console.log(data.player);
        //     sockets.emit("move2",data.player);
        // } else {
        //     console.log("player2");
        //     console.log(data.player);
        //     sockets.emit("move",data.player);
        // }
        sockets.emit("move",data.player);     
    });
});

