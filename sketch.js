var trex, trex_running, trex_collided;
var PLAY = 1, END = 0, WIN = 2;
var obstaclesGroup, obstacle1;
var jungle, invisiblejungle;
var gameOver, restart;
var gameState = PLAY;
var score = 0;

function preload(){

  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  collidedSound = loadSound("assets/collided.wav");
  gameOverImg = loadImage("assets/fimdejogo.png");
  restartImg = loadImage("assets/restart.png");
  obstacle1 = loadImage("assets/stone.png");
  jumpSound = loadSound("assets/jump.wav");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");  
}

function setup(){

  createCanvas(800, 400);

  jungle = createSprite(400, 100, 400, 20);
  jungle.addImage("jungle", jungleImage);
  jungle.x = width/2;
  jungle.scale = 0.3;

  kangaroo = createSprite(50, 200, 20, 50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.setCollider("circle", 0, 0, 300);
  kangaroo.scale = 0.15;
    
  invisibleGround = createSprite(400, 350, 1600, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(400, 100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550, 140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw(){

  background(255);
  game();
  
  kangaroo.x = camera.position.x-270;   
}

function game(){

  if (gameState === PLAY){

    jungle.velocityX = -3

    if(jungle.x < 100){
       jungle.x = 400;
    }

    kangaroo.collide(invisibleGround);
    kangaroo.velocityY += 0.8;
    spawnObstacles();
    spawnShrubs();

    if(keyDown("space") && kangaroo.y > 270){
      kangaroo.velocityY = -16;
      jumpSound.play();
    }
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }

    if(shrubsGroup.isTouching(kangaroo)){
      shrubsGroup.destroyEach();
      score += 1;
    }

  } else if (gameState === END){

    kangaroo.changeAnimation("collided",kangaroo_collided);
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setLifetimeEach(-1);
    shrubsGroup.setVelocityXEach(0);
    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;    
    
    if(mousePressedOver(restart)){
      reset();
    }

  } else if (gameState === WIN){

    kangaroo.changeAnimation("collided",kangaroo_collided);
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setLifetimeEach(-1);
    shrubsGroup.setVelocityXEach(0);
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
  }

  drawSprites();

  textFont("Geórgian");
  strokeWeight(7);
  fill("yellow");
  textSize(50);
  stroke(0);
  text(score, camera.position.x, 50);
  
  if(score >= 5){

    obstaclesGroup.destroyEach();
    kangaroo.visible = false;
    gameState = WIN;

    fill("limeGreen");
    text("VOCÊ VENCEU!", camera.position.x-165, 220);
  }
}

function spawnShrubs(){
 
  if (frameCount % 150 === 0){

    var shrub = createSprite(camera.position.x+500, 330, 40, 10);
    shrub.setCollider("rectangle", 0, 0, shrub.width/2, shrub.height/2);
    shrub.velocityX = -(6 + 3*score/100);
    shrub.lifetime = 400;
    shrubsGroup.add(shrub);
    shrub.scale = 0.05;   

    var rand = Math.round(random(1,3));

    switch(rand){
      case 1: shrub.addImage(shrub1);
        break;
      case 2: shrub.addImage(shrub2);
        break;
      case 3: shrub.addImage(shrub3);
        break;
      default: break;
    }
  }
}

function spawnObstacles(){

  if(frameCount % 120 === 0){

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle", 0, 0, 200, 200);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.addImage(obstacle1);
    obstaclesGroup.add(obstacle);
    obstacle.lifetime = 400;
    obstacle.scale = 0.15;    
  }
}

function reset(){

  kangaroo.changeAnimation("running", kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  gameState = PLAY;
  score = 0;
}