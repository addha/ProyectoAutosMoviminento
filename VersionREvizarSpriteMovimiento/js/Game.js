class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);
////////////////////////////////////////////////////////////////////////////////
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);
////////////////////////////////////////////////////////////////////////
    this.leadeboardTitle.html("Puntuación");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car1.addImage("blast", blastImage);

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    car2.addImage("blast", blastImage);

    cars = [car1, car2];




     //CREacion de Grupos  de objetos

  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  
  play() {
    this.handleElements();
    this.handleResetButton();// ///////////////////////////////77crear 

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

   /*   this.showFuelBar();
      this.showLife();
      this.showLeaderboard();
*/
      //índice de la matriz
      var index = 0;
      for (var plr in allPlayers) {
        //agrega 1 al índice por cada bucle
        index = index + 1;

        //utiliza datos de la base de datos para mostrar los autos en las direcciones x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentlife = allPlayers[plr].life;

        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
/*
          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarACollisionWithCarB(index);
          this.handleObstacleCollision(index);
     
          */
          

          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

          // Cambiar la posición de la cámara en la dirección y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      ////////////////////////////7realizar el movimiento del auto
      if (this.playerMoving) {
        //console.log("this.playerMoving____"+this.playerMoving)
        //player.positionY += 5;  // realiza un movimieto constante del auto
        player.update();
      }

      // manejando eventos teclado
      this.handlePlayerControls();

      // Línea de meta
      const finshLine = height * 6 - 100;
      
        //console.log("finshLine::::::::::::::::::::::: "+finshLine )


      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      //console.log("di de alta   player positiony iguala lineFinal"+player.positionY)
      drawSprites();
    }
  }

  handleResetButton() {
  ///////////////////r  esetButton
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }


  handlePlayerControls() {

  //  console.log("  handlePlayerControls()   entro al metodo")
    if (!this.blast) {
      
    console.log("  blast___________________________________")
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 5;
        console.log("se mueve arriba auto  __________se mueve jugador 5 px___________")
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true;
        player.positionX -= 5;
        player.update();
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
      }
    }
  }

  showRank() {
    swal({
        title:"Que pro",
        text:"Eres el mejor",
        imageUrl:"https://i.postimg.cc/qBWZ1W4w/que-pro.jpg", imageSize:"100 x 100",
        confirmButtonText:"Sigue asi papu"
    });
  }

  gameOver() {
    swal({
        title:"Fin del juego tremendo manco",
        text:"Suerte para la proxima, manco",
        imageUrl:"https://i.postimg.cc/zB5cFhNr/Manos-para-quitar-lo-manco.jpg", imageSize:"100 x 100",
        confirmButtonText:"Asta luago manco"
    });
  }



end(){
    console.log(" game.js////////////fin del juego")
}




//Anexos Funciones____________________________________________________________________________________________

//cReacion de diseño de tabla de score de los jugadores y sus funcines respectivas
  //Mostrar linea de  vida showLife()
  //mostrar linea de gasolina showFuelBar()
  //mostrr  tabla de jugadores showLeaderboard() 

  
   // anexar metodo  que de poder al auto con el objeto gasolina  con index como argumento de entrada
  // andleFuel(index)(index) 
  // anexar metodo  que del poder al auto con las monedas obtenidas con index como argumento de entrada
  // anexar metodo colicion de obstaculos  con index como argumento de entrada
  // handleObstacleCollision(index)
  // anexar metodo colicion de autos  con index como argumento de entrada
  //handleCarACollisionWithCarB(index){}
}
