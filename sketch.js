const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
let engine;
let world;
var canvasWidth, canvasHeight;

var ground;
var rope1, rope2, rope3;
var fruit, fruitImg;
var fruitConnection1, fruitConnection2, fruitConnection3;
var rabbit, blink, eat, sad;
var backgroundImg;
var balloon;

var cutBtn1, cutBtn2, cutBtn3;
var muteBtn;

var bgSnd, cutSnd, eatSnd, sadSnd, airSnd;

function preload(){
  fruitImg = loadImage("assets/images/melon.png");
  backgroundImg = loadImage("assets/images/background.png");
  blink = loadAnimation("assets/images/animations/blink_1.png","assets/images/animations/blink_2.png","assets/images/animations/blink_3.png");
  eat = loadAnimation("assets/images/animations/eat_0.png","assets/images/animations/eat_1.png","assets/images/animations/eat_2.png","assets/images/animations/eat_3.png","assets/images/animations/eat_4.png");
  sad = loadAnimation("assets/images/animations/sad_1.png","assets/images/animations/sad_2.png","assets/images/animations/sad_3.png");
  
  bgSnd = loadSound("assets/sounds/music.mp3");
  cutSnd = loadSound("assets/sounds/rope_cut.mp3");
  eatSnd = loadSound("assets/sounds/rabbit_eat.mp3");
  sadSnd = loadSound("assets/sounds/rabbit_sad.mp3");
  airSnd = loadSound("assets/sounds/balloon_blow.mp3");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  eat.looping = false;
  sad.looping = false;
}

function setup(){
  var isMobile = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
  if(isMobile == true){
    canvasWidth = displayWidth;
    canvasHeight = displayHeight;
    createCanvas(canvasWidth+80,canvasHeight);
  } else{
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth,canvasHeight);
  }

  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,canvasHeight-10,600,20);

  bgSnd.play();
  bgSnd.setVolume(0.1);

  rope1 = new Rope(8, {x: width/2, y: 30});
  rope2 = new Rope(18, {x: width/4/2, y: 100});
  rope3 = new Rope(18, {x: width/4+width/2+40, y: 150});
  
  var fruitOptions = {density:0.001};

  fruit = Bodies.circle(300, 300, 15, fruitOptions);
  Matter.Composite.add(rope1.body, fruit);

  fruitConnection1 = new Link(rope1, fruit);
  fruitConnection2 = new Link(rope2, fruit);
  fruitConnection3 = new Link(rope3, fruit);

  blink.frameDelay = 7;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  rabbit = createSprite(170, canvasHeight-80, 100, 100);
  rabbit.scale = 0.2;

  rabbit.addAnimation("blink",blink);
  rabbit.addAnimation("eating",eat);
  rabbit.addAnimation("crying",sad);

  // balloon = createImg("assets/images/balloon.png");
  // balloon.position(10, 250);
  // balloon.size(150, 100);
  // balloon.mouseClicked(blowAir);

  // Buttons
  cutBtn1 = createImg("assets/images/cutBtn.png");
  cutBtn1.position(width/2-40/2, 30);
  cutBtn1.size(40, 40);
  cutBtn1.mouseClicked(fruitDrop1);

  cutBtn2 = createImg("assets/images/cutBtn.png");
  cutBtn2.position(width/4/2, 100);
  cutBtn2.size(40, 40);
  cutBtn2.mouseClicked(fruitDrop2);

  cutBtn3 = createImg("assets/images/cutBtn.png");
  cutBtn3.position(width/4+width/2, 150);
  cutBtn3.size(40, 40);
  cutBtn3.mouseClicked(fruitDrop3);

  muteBtn = createImg("assets/images/muteBtn.png");
  muteBtn.position(450, 10);
  muteBtn.size(40, 40);
  muteBtn.mouseClicked(muteSnd);


  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function muteSnd(){
  if(bgSnd.isPlaying() || airSnd.isPlaying() || cutSnd.isPlaying() || eatSnd.isPlaying()){
    bgSnd.stop();
    airSnd.stop();
    cutSnd.stop();
    eatSnd.stop();
  } else{
    bgSnd.play();
  }
}

function fruitDrop1(){
  rope1.break();
  fruitConnection1.detach();
  fruitConnection1 = null;
  cutSnd.play();
}
function fruitDrop2(){
  rope2.break();
  fruitConnection2.detach();
  fruitConnection2 = null;
  cutSnd.play();
}
function fruitDrop3(){
  rope3.break();
  fruitConnection3.detach();
  fruitConnection3 = null;
  cutSnd.play();
}

function blowAir(){
  Matter.Body.applyForce(fruit, {x: 0, y: 0}, {x: 0.01, y: 0});
  airSnd.play();
  airSnd.setVolume(0.05);
}

function draw(){
  background(51);
  image(backgroundImg, canvasWidth/2, canvasHeight/2, canvasWidth+80, canvasHeight);
  
  ground.display();

  rope1.display();
  rope2.display();
  rope3.display();
  // image(fruitImg, fruit.position.x, fruit.position.y, 65, 65);

  if(fruit != null){
    image(fruitImg, fruit.position.x, fruit.position.y, 65, 65);
  }

  if(collide(fruit, rabbit) == true){
    rabbit.changeAnimation("eating");
    eatSnd.play();
  }
  if(collide(fruit, ground.body) == true){
    rabbit.changeAnimation("crying");
    bgSnd.stop();
    sadSnd.play();
  }
  
  if(fruit != null && fruit.position.y > 650){
    rabbit.changeAnimation("crying");
    bgSnd.stop();
    sadSnd.play();
    fruit = null;
  }

  Engine.update(engine);
  drawSprites();
}

function collide(body, sprite){
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d <= 80){
      World.remove(world, fruit);
      fruit = null;
      return true;
    } else{
      return false;
    }
  }
}
