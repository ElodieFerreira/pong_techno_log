# pong_techno_log

Ce pong est réalisé dans le cadre d'un projet universitaire

## Lancement
Cloner le projet. 
Lancer le serveur.
```
node server.js
```
Lancer la page HTML

## Créer une partie

Vous pouvez créer une partie en rentrant un nom sur le menu et sélectionnant "Ok", vous rejoindrez directement votre partie.
Vous pouvez choisir grâce au bouton radio le nombre de personnes disponibles dans la salle.

## Rejoindre une partie

A la connexion sur la page, notre page affiche les rooms disponibles. On peut en sélectionner une. Mais si cette dernière est déjà pleine, on ne peut pas la choisir.

## Fin de partie
Le jeu s'arrête lorsqu'une gagne a marqué 10 points. Refresh la page.

### A venir : 
Suppression des salles déjà terminées.
Amélioration CSS.
Boite de dialogue.
Déconnexion d'un joueur.

### Choix  sur le TD: 

Faire calculer les positions aux clients ( joueurs, balle ) entrainait sur mon PC une latence entre le mouvement sur un client et sur les autres clients. ( Latence notammment sur les joueurs, qui n'était pas présente sur tous les PC où je testais ). Pour palier à cela, les calculs sont tous effectués dans le serveur, ainsi chaque client reçois l'information en même temps. Cela rajoute néanmoins un appel initial pour récupérer les données. 

#### Pourquoi le passage des players dans un tableau ? 
Le but était de rendre plus générique certaines méthodes : itérer sur le tableau. Pouvoir choisir l'index de notre currentPlayer. Mais aussi dans le but de rajouter peut-être d'autres joueurs. ( On peut imaginer un très grand pong ! )

#### Pourquoi Socket ? 
Pour éviter que le client doivent requêter en boucle le serveur. Ainsi le client est notifié sur les changements. 
De plus, l'implémentation était rapide et en très peu de code sans toucher énormément au code de base, on pouvait obtenir un résultat assez concluant. 

#### Améliorations possibles ? 
Le GameBuilder aurait put être un objet game. Cela reviendrait au même, un possible refactoring à venir là dessus.

