
var trex, trexRunning;
var ground;
var groundImage;
var invisibleGround;
var cloud;
var cloudImage;
var obstacle, obstImg1, obstImg2, obstImg3, obstImg4, obstImg5, obstImg6;
var score = 0;
var record = 0;
var play = 1;
var end = 0;
var gameState = play;
var obstaclesJP,cloudsJP;
var trexCollided;
var gameOver,gameOverImg;
var restart,restartImg;
var jumpSound,deathSound,pointSound;

//preload carrega as midías do jogo 
function preload() {
  groundImage = loadImage("ground2.png");
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  cloudImage = loadImage("cloud.png");
  obstImg1 = loadImage("obstacle1.png")
  obstImg2 = loadImage("obstacle2.png")
  obstImg3 = loadImage("obstacle3.png")
  obstImg4 = loadImage("obstacle4.png")
  obstImg5 = loadImage("obstacle5.png")
  obstImg6 = loadImage("obstacle6.png")
  trexCollided = loadAnimation("trex_collided.png")
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("die.mp3");
  pointSound = loadSound("checkpoint.mp3");
}

//setup faz a aconfiguração
function setup() {
  createCanvas(windowWidth, windowHeight);
    trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collide",trexCollided);
  trex.scale = 0.5;
  trex.debug = false;
  //trex.setCollider ("rectangle",0,0,80,100);
  trex.setCollider ("circle",-5,15,30)

  ground = createSprite(width/2, height-130, 600, 2);
  ground.addImage("ground", groundImage);
  invisibleGround = createSprite(width/2, height-10, 600, 2);
  invisibleGround.visible = false;
  obstaclesJP = new Group();
  cloudsJP = new Group();

  gameOver = createSprite(width/2,height-120);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(width/2,height-80);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

}

//draw faz o movimento, a ação do jogo
function draw() {
  background("#f0f9f7");

  textSize(18);
  fill("black");
  text("Score: " + score, width-100, height-100);
  text("Record: " + record, width-100, height-80);

  if (gameState === play) {
    score += Math.round(getFrameRate()/60);
    if (score > 0&&score%100===0){
      pointSound.play();
    }
    ground.velocityX = -(4 + score/100);
    if (ground.x < 800) {
      ground.x = ground.width / 2
    }
    if (touches.length > 0||keyDown("space") && trex.y > height-40) {
      trex.velocityY = -11;
      touches = [];
    }
    createCloud()
    createObstacles()
  }
  if (trex.isTouching(obstaclesJP)){
    gameState=end;
    deathSound.play();
  }


  if (gameState === end) {
    trex.changeAnimation("collide",trexCollided);
    ground.velocityX = 0;
    cloudsJP.setVelocityXEach(0);
    obstaclesJP.setVelocityXEach(0);
    cloudsJP.setLifetimeEach(-1);
    obstaclesJP.setLifetimeEach(-1);
    restart.visible = true;
    gameOver.visible = true;


    if (record < score) {
      record = score
    }

    if (mousePressedOver(restart)) {
    gameState = play;
    obstaclesJP.destroyEach();
    cloudsJP.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trexRunning)
    score = 0
    }
  }

 
  



  if (keyDown("space") && trex.y > 164) {
    trex.velocityY = -11;
    jumpSound.play();
  }
  trex.velocityY = trex.velocityY + 0.5;
  trex.collide(invisibleGround);
  //coordenadas do mouse na tela
  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
  drawSprites();

}

function createCloud() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width/2, random(height-190, height-100), 40, 10);
    cloud.velocityX = -(4 + score/100);
    cloud.addImage(cloudImage);
    cloud.scale = random(0.4, 1.4);
    cloud.depth = trex.depth - 1
    cloud.lifetime = width/cloud.velocityX;
    cloudsJP.add(cloud)
  }

}

function createObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(width/2,height-100,40,10)
    obstacle.velocityX = -(4 + score/100);
    obstacle.lifetime = width/obstacle.velocityX;
    obstaclesJP.add(obstacle)
    obstacle.scale = 0.5
    var sorte = Math.round(random(1, 6))

    switch (sorte) {

      case 1: obstacle.addImage(obstImg1)

        break;

      case 2: obstacle.addImage(obstImg2)

        break;

      case 3: obstacle.addImage(obstImg3)

        break;

      case 4: obstacle.addImage(obstImg4)

        break;

      case 5: obstacle.addImage(obstImg5)

        break;

      case 6: obstacle.addImage(obstImg6)

        break;

    }

  }
}