//declaring variables
var path, pathImg;
var player, playerImg, playerCollided;

var bgImage;

var lavaBall, lavaBall_Img;
var energy, energyImg;

var bullet, bulletImg;
var cash, cashImg1, cashImg2;

var lavaBallGroup, energyGroup, bulletGroup, cashGroup;

var energyLeft = 6;
var lavaBallsDestroyed = 0;
var cashCollected = 0;

var sound1, sound2, sound3, sound4, sound5;

var retry, retryIcon;

//declaring gameStates-
var PLAY = 0;
var END = 1;
var gameState = 0;

//function to load Images, Animations, Sounds, etc...
function preload(){
  //loading images
  pathImg  = loadImage("bgImg.jpg");
  playerImg = loadImage("plane1.png");
  lavaBall_Img = loadImage("lava.png");
  energyImg = loadImage("energy.png");
  bulletImg = loadImage("bullet.png");
  cashImg1 = loadImage("cash1.png");
  cashImg2 = loadImage("cash2.png");
  bgImage = loadImage("BackgroundImg.png");
  playerCollided = loadImage("option2.jpg");
  retryIcon = loadImage("retry.png");

  //loading sound
  sound1 = loadSound("shoot.mp3");
  sound2 = loadSound("gameSound.mp3");
  sound3 = loadSound("lose.mp3");
  sound4 = loadSound("gameSound2.mp3");
  sound5 = loadSound("bgMusic.mp3");
}

//setup function -
function setup(){
  //canvas
  createCanvas(400, 500);
  
    //playing background music
    sound5.play();

  //creating the path
  path = createSprite(200, 50);
  path.addImage(pathImg);
  path.scale = 1.3;
  path.velocityY = 4;

  //creating the player
  player = createSprite(200, 475, 50, 50);
  player.addImage(playerImg);
  player.scale = 1.6;

  //creating the bullet
  bullet = createSprite();
  bullet.addImage(bulletImg);
  bullet.scale = 0.31;
  bullet.visible = false;

  //creating the retry button
  retry = createSprite(300, 250, 50, 50);
  retry.addImage(retryIcon);
  retry.scale = 0.4;
  retry.visible = false;

  //creating the groups -
  lavaBallGroup = new Group();
  energyGroup = new Group();
  bulletGroup = new Group();
  speedUpGroup = new Group();
  cashGroup = new Group();
}

//draw function -
function draw(){
  //background color
  background("orange");

  //gameState -
   if(gameState === PLAY){

     //making infinite path
    if(path.y > 300){
      path.y = height/2;
     }
   
     //giving movement to the player
     player.x = World.mouseX;
     bullet.x = player.x;
     
     //calling the functions -
  appearLavaBalls();
  appearEnergy();
  appearBullets();
  appearCash();

  //game adptivity -
  if(lavaBallsDestroyed === 5){
    //increasing velocity -
    path.velocityY = 5;
    lavaBallGroup.setVelocityYEach(5);
    energyGroup.setVelocityYEach(5);
  }
  //game adptivity -
  else if(lavaBallsDestroyed === 10){
    //increasing velocity -
    path.velocityY = 6;
    lavaBallGroup.setVelocityYEach(6);
    energyGroup.setVelocityYEach(6);
  }

  //Touching functions -
  if (energyGroup.isTouching(player)) {
    //destroying energy 
    energyGroup.destroyEach();

    ///incrementing fuels left
    energyLeft += 1;

    //playing sound
    sound2.play();
  }
  else if(bulletGroup.isTouching(lavaBallGroup)){
    //destroying lava balls
    lavaBallGroup.destroyEach();
    //bullet y position
    bullet.y = -5;
    ///incrementing lava balls destroyed
    lavaBallsDestroyed += 1;
  }
  else if(keyWentDown("enter")){
    //decreasing fuels left
    energyLeft -= 1;
  }
  else if(cashGroup.isTouching(player)) {
    //incrementing cash collected+
    cashCollected += random([50, 100]);
    //destroying cash
    cashGroup.destroyEach();
    //playing sound
    sound4.play();
  }
  else if(lavaBallGroup.isTouching(player)) {
  //changing gameState -
    gameState = END;

    //destroying and setting veocity as 0 -
    energyGroup.destroyEach();
    energyGroup.setVelocityYEach(0);
    lavaBallGroup.destroyEach();
    lavaBallGroup.setVelocityYEach(0);
    cashGroup.destroyEach();
    cashGroup.setVelocityYEach(0);

    path.velocityY = 0;
    //making path invisible
    path.visible = false;

    //adding background image
    background(bgImage);

    //changing player image
    player.addImage(playerCollided);
  } 
   }
   //gameState -
   else if(gameState === END){
     //showing texts
     fill("blue");
    text("You lost !! Try better next time.", 150, 200);
    text("To fly again with your jet click here - ", 50, 250);

   //playing sound
   sound3.play();

   //making visible
   retry.visible = true;

   //mousePressed command
   if(mousePressedOver(retry)){
     //calling reset function 
     reset();
   }
  }
   
   //creating edges and colliding the player with it.
   edges = createEdgeSprites();
   player.collide(edges);

   //drawing everything
  drawSprites();

  //text styles-
  textSize(15);
  fill("black");
  textFont("seoge script");
  text("Energy Left is "+ energyLeft, 5, 20);
  text("Lava Balls Destroyed :- "+ lavaBallsDestroyed, 5, 40);
  text("Cash Collected = "+ cashCollected, 5, 60);
}
//function to spawn lava balls -
function appearLavaBalls(){
  if(World.frameCount % 150 === 0){
  lavaBall = createSprite(Math.round(random(50, 350),40, 10, 10));
  lavaBall.velocityY = 4;
  lavaBall.lifetime = 150;
  lavaBall.addImage(lavaBall_Img);
  lavaBall.scale = 0.31;

  lavaBallGroup.add(lavaBall);
  }
}

//function to spawn energy -
function appearEnergy(){
  if(World.frameCount % 200 === 0){
  energy = createSprite(Math.round(random(20, 300),40, 10, 10));
  energy.velocityY = 4;
  energy.lifetime = 150;
  energy.addImage(energyImg);
  energy.scale = 0.31;
  
  energyGroup.add(energy);
  }
}

//function to spawn bullets -
function appearBullets(){
  if(keyDown("enter")){
  bullet.velocityY = -4;
  bullet.visible = true;
  //playing sound
  sound1.play();
 }

 if(bullet.y < 0){
   bullet.y = player.y + 25;
   bullet.x = player.x + 50;
   bullet.velocityY = 0;
   bullet.visible = false;
 }

 bulletGroup.add(bullet);
}

//function to spawn cash -
function appearCash(){
  if(World.frameCount % 310 === 0){
    cash = createSprite(Math.round(random(15, 250),40, 10, 10));

    //generate random cash
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: cash.addImage(cashImg1);
              break;
      case 2: cash.addImage(cashImg2);
              break;        
      default: break;
    }

    cash.velocityY = 4;
    cash.lifetime = 150;
    
    cash.scale = 0.42;

    cashGroup.add(cash);
    }
}

//function to reset the game -
function reset(){
  //changing gameState
  gameState = PLAY;

  //making visible and invisible -
  retry.visible = false;
  path.visible = true;

  //giving velocity
  path.velocityY = 4;
  
  //destroying each
  lavaBallGroup.destroyEach();
  energyGroup.destroyEach();
  cashGroup.destroyEach();
  
  //recounting values
  energyLeft = 6;
  lavaBallsDestroyed = 0;
  cashCollected = 0;

  //changing image
  player.addImage(playerImg);
}