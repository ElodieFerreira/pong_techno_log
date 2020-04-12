game.control = {
	mousePointer : null,
	controlSystem: null,
	onKeyDown : function(event) {
		game.control.controlSystem = "KEYBOARD";
		if ( event.keyCode == game.keycode.KEYDOWN ) {
			game.playerOne.goDown = true;
		} else if ( event.keyCode == game.keycode.KEYUP ) {
			game.playerOne.goUp = true;
		}
		toSend= {
			source: "player2",
			player: game.playerOne
		}
		game.playerOne.source = "player2";
		game.socket.emit("playerOne",toSend);
	},

	onKeyUp : function(event) {
		if ( event.keyCode == game.keycode.KEYDOWN ) {
			game.playerOne.goDown = false;
		} else if ( event.keyCode == game.keycode.KEYUP ) {
			game.playerOne.goUp = false;
		}
		toSend= {
			source: "player2",
			player: game.playerOne
		}
		game.playerOne.source = "player2";
		game.socket.emit("playerOne",toSend);
	},

	onMouseMove : function(event) {
		// game.control.controlSystem = "MOUSE";
		// if ( event ) {
		// 	game.control.mousePointer = event.clientY;
		// }
		//
		// if ( game.control.mousePointer > game.playerOne.posY ) {
		// 	game.playerOne.goDown = true;
		// 	game.playerOne.goUp = false;
		// } else if ( game.control.mousePointer < game.playerOne.posY ) {
		// 	game.playerOne.goDown = false;
		// 	game.playerOne.goUp = true;
		// } else {
		// 	game.playerOne.goDown = false;
		// 	game.playerOne.goUp = false;
		// }
	}
}
