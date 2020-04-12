game.ai = {
  player : null,
  ball : null,
 
  setPlayerAndBall : function(player, ball) {
    this.player = player;
    this.ball = ball;
  },
   
  move : function() {
    if ( this.ball.directionX == 1 ) {
      if ( this.player.originalPosition == "right" ) {
        // la balle se dirige vers l'ia
        this.followBall();
      }
      if ( this.player.originalPosition == "left" ) {
        // retour vers le centre parce que la balle va vers l'adversaire
        this.goCenter();
      }    
    } else {
      if ( this.player.originalPosition == "right" ) {
        // la balle se dirige vers l'ia
        this.goCenter();
      }
      if ( this.player.originalPosition == "left" ) {
        // retour vers le centre parce que la balle va vers l'adversaire
        this.followBall();
      }  
    }
  },
 
  followBall : function() {
  	 if ( this.ball.posY < this.player.posY + this.player.height/2 ) {
      // la position de la balle est sur l'écran, au dessus de celle de la raquette
      this.player.posY--;
    } else if ( this.ball.posY > this.player.posY + this.player.height/2 ) {
      // la position de la balle est sur l'écran, en dessous de celle de la raquette
      this.player.posY++;
    }
  },
 
  goCenter : function() {
  	if ( this.player.posY + this.player.height/2 > game.groundHeight / 2 ) {
      this.player.posY--;
    } else if ( this.player.posY + this.player.height/2 < game.groundHeight / 2 ) {
      this.player.posY++;
    }
  }
}