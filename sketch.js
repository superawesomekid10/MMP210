// Scene variable
var scene = "menu";

//Objects
var player1, player2, ball;

//Variables
// Declare a "SerialPort" object
var serial;

// fill in the name of your serial port here:
//copy this from the serial control app
var portName = "/dev/tty.usbmodem14701";

//this array will hold transmitted data
var inMessage = [0, 0];
const winningscore = 3;
var PLAYER_WIDTH = 10;
var PLAYER_HEIGHT = 100;

var result = "";

//Variable that tells if user started the game or not
var started = false;

// Images
var backgroundImage;
var menuBackgroundImage;
var playButtonImage;
var darkPlankImage;
var lightPlankImage;
var ballImage;

// Sounds
var backgroundSound;
var hitSound;
var bounceSound;
var deadSound;
var winningSound;

function preload(){
  menuBackgroundImage = loadImage('menubackground.jpg'); // Google graphics @Dark zyros
  backgroundImage = loadImage('background.jpg'); // Google graphics
  playButtonImage = loadImage('playbutton.png'); // Itch.io
  darkPlankImage = loadImage('darkplank.jpg');
  lightPlankImage = loadImage('lightplank.jpg');
  ballImage = loadImage('ball.png');
  backgroundSound = loadSound('backgroundmusic.mp3'); // Chosic.com
  hitSound = loadSound('hit.wav'); // Jfxr sound
  bounceSound = loadSound('bounce.wav'); // Jfxr sound
  deadSound = loadSound('dead.wav'); // Jfxr sound
  winningSound = loadSound('winning.wav'); // Jfxr sound
}

function setup(){
  //Creating canvas
  createCanvas(800,500);
  
  // make an instance of the SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results. See gotList, below:
  serial.list();

  // Assuming our Arduino is connected,  open the connection to it
  serial.open(portName);

  // When you get a list of serial ports that are available
  serial.on('list', gotList);

  // When you some data from the serial port
  serial.on('data', gotData);
  
    //Setting up the font
  textFont("Creepster");
  
  // Controlling the sound
  backgroundSound.setVolume(0.2);
  hitSound.setVolume(0.4);
  bounceSound.setVolume(0.2);
  deadSound.setVolume(0.4);
  winningSound.setVolume(0.2);
  
  //OBJS
  player1 = {
	x: 0,
	y: height / 2 - PLAYER_HEIGHT / 2,
    h: PLAYER_HEIGHT,
	vel: 0,
	points: 0
  };
  player2 = {
	x: width - PLAYER_WIDTH,
	y: height / 2 - PLAYER_HEIGHT / 2,
    h: PLAYER_HEIGHT,
	vel: 0,
	points: 0
  };
  ball = {
    r: 20,
	x: width / 2,
	y: height / 2 - 20,
	xvel: 4,
	yvel: 4
  };
  
}
  // Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}
  
  // Called when there is data available from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming data
  trim(currentString);                    // trim off trailing whitespace
  if (!currentString) return;             // if the incoming string is empty, do no more
  // console.log(currentString);
      inMessage = split(currentString, '&');   // save the currentString to use for the text
}
  


//Drawing shape
function drawPaddles(){
    image(darkPlankImage, 0, player1.y, PLAYER_WIDTH, player1.h);
    image(lightPlankImage, width - PLAYER_WIDTH, player2.y, PLAYER_WIDTH, player2.h);
}
//Drawing shape
function drawBall(){
	fill(255);
    image(ballImage, ball.x - ball.r/2, ball.y - ball.r/2, ball.r, ball.r);
}

//Drawing text
function drawScore(){
  fill(255);
  textSize(75);
  stroke(255);
  strokeWeight(3);
  textAlign(CENTER);
  
  text(player1.points, width/4, 100);
  text(player2.points, width - width/4, 100);
}

//Drawing text
function drawInfo(){
	let info;
	if(result=="")
	{
      if(player1.points > 0 || player2.points > 0) info = "Move your paddle to continue...";
      else
      {
          info = "Move your paddle to start the game...";

      }
	}
	else
	{
		info = result + " player wins!";
	}

  fill(0);
  textSize(40);
  stroke(255);
  strokeWeight(2);
  textAlign(CENTER);
  text(info, width/2, height - height/4);
}

// When key is pressed
function keyPressed(){
	
	if(player1.points < winningscore && player2.points < winningscore)
      {
        let code = keyCode;
        if(code == 38) // Up arrow
        {
          if(!started)
          {
              started = true;
          }

          player2.vel = -6;
        }
        else if(code == 40) // Down arrow
        {
          if(!started)
          {
              started = true;
          }
          player2.vel = 6;
        }

        if(code == 87) // W
        {
          if(!started)
          {
              started = true;
              if(result != "")
              {
                  player1.points = 0;
                  player2.points = 0;
                  player1.h = PLAYER_HEIGHT;
                  player2.h = PLAYER_HEIGHT;
                  result = "";
              }
          }
          player1.vel = -6;
        }
        else if(code == 83) // S
        {
          if(!started)
          {
              started = true;
              if(result != "")
              {

              }
          }
          player1.vel = 6;
        }
      }
}

//When key is released
function keyReleased(){
	let code = keyCode;
	if(code == 38) // Up arrow
	{
		player2.vel = 0;
	}
	else if(code == 40) // Down arrow
	{
		player2.vel = 0;
	}

	if(code == 87) // W
	{
		player1.vel = 0;
	}
	else if(code == 83) // S
	{
		player1.vel = 0;
	}
}

// Giving to paddles min and max Y where they can move
function constrainPaddles(){
	if(player1.y < 0) player1.y = 0;
	if(player2.y < 0) player2.y = 0;

	if(player1.y > height - player1.h) player1.y = height - player1.h;
	if(player2.y > height - player2.h) player2.y = height - player2.h;
}

// Ball collision
function ballCollision(){
	//With up or down border
	if(ball.y - ball.r < 0 || ball.y + ball.r > height){
      ball.yvel *= -1;
      bounceSound.play();      
    }
	//Ball with left border
	if(ball.x - ball.r <= 0)
	{
      player2.points++;
      started = false;
      player1.h = PLAYER_HEIGHT;
      player2.h = PLAYER_HEIGHT;
      deadSound.play();
	}
	//Ball with right border
	if(ball.x + ball.r >= width)
	{
	  player1.points++;
	  started = false;
      player1.h = PLAYER_HEIGHT;
      player2.h = PLAYER_HEIGHT;
      deadSound.play();
	}
	//Ball with paddles, there is also a custom bounce system. Ball yvel depend on difference between the ball pos and paddle center
	if(ball.x - ball.r < PLAYER_WIDTH || ball.x + ball.r > width-PLAYER_WIDTH)
	{
		if(ball.xvel < 0 && ball.y > player1.y && ball.y < player1.y + player1.h)
		{
			let diff = (player1.y+player1.h/2) - ball.y;
      if(ball.yvel < -4)
      {
        ball.yvel = -4;
        if(diff < 0) ball.yvel -= diff * height/10000*2;
      }
      else if(ball.yvel > 4)
      {
        ball.yvel = 4;
        if(diff > 0) ball.yvel -= diff * height/10000*2;
      }
      else
      {
        ball.yvel -= diff * height/10000*2;
      }
			ball.xvel *= -1; // Changing direction
			ball.xvel += 0.4; // Adding more force each bounce
            hitSound.play();

		}
		else if(ball.xvel > 0 && ball.y > player2.y && ball.y < player2.y + player2.h)
		{
			let diff = (player2.y+player2.h/2) - ball.y;
      if(ball.yvel < -4)
      {
        ball.yvel = -4;
        if(diff < 0) ball.yvel -= diff * height/10000*2;
      }
      else if(ball.yvel > 4)
      {
        ball.yvel = 4;
        if(diff > 0) ball.yvel -= diff * height/10000*2;
      }
      else
      {
        ball.yvel -= diff * height/10000*2;
      }
			ball.xvel *= -1;// Changing direction
			ball.xvel -= 0.4;// Adding more force each bounce
            hitSound.play();
		}
	}
}

// Updating balls positions
function ballMovement(){

	ball.x += ball.xvel;
	ball.y += ball.yvel;
}

// Checking score
function scoreSystem(){

	if(player1.points >= winningscore)
	{
	  result = "Left"; // Result is left wins
      winningSound.play();
      setTimeout(() => {scene = "menu"; backgroundSound.stop();}, 5000);
	}
	if(player2.points >= winningscore)
	{
	  result = "Right"; // Result is right wins
      winningSound.play();
      setTimeout(() => {scene = "menu"; backgroundSound.stop();}, 5000);
	}
}

function draw(){
  
  player1.y=map(inMessage[0],-60,60,0,height,1)
  
   background(255,255,255);
  fill(0,0,0);
console.log(inMessage[0]);
  
  if(scene == "menu"){
    //Background
    image(menuBackgroundImage, 0 ,0, width, height);
    noTint();
    // Button
    image(playButtonImage, width/2- 150, height/2 - 50, 300, 100);
    if(mouseX > width/2- 150 &&
       mouseX < width/2- 150 + 300 &&
       mouseY > height/2 - 50 &&
       mouseY < height/2 - 50 + 100){
      
      if(mouseIsPressed){
        tint(100,100,100);
        scene = "game";
        backgroundSound.loop();
        player1.points = 0;
		player2.points = 0;
        player1.h = PLAYER_HEIGHT;
        player2.h = PLAYER_HEIGHT;
		result = "";
      } else tint(210,210,210);
    }
  }
  else if(scene == "game"){
    if(started)
	{
		constrainPaddles(); // Function that keeps paddles on the screen, they can't go outside

		ballCollision(); // Checking ball collision (X and Y border, paddles)

		ballMovement(); // Updating ball position

		scoreSystem(); // Function that checks the score and gives a particular result in the end

		player1.y += player1.vel;
		player2.y += player2.vel;
	}
	else { // In else it is basically a classic reset of all positions
		player1.y = height / 2 - player1.h / 2;
		player2.y = height / 2 - player2.h / 2;

		ball.x = width/2;

		ball.y = height / 2 - 20;

		ball.xvel = 4;
		ball.yvel = 4;
	}
  
  
  //Drawing background
  image(backgroundImage, 0, 0, width, height);
  noTint();
  //Displaying players score on the screen
  drawScore();
  //Drawing player paddles
  drawPaddles();
  //Drawing a ball
  drawBall();

  //If the game is running
  if(!started) drawInfo(); //Drawing information (Move your paddle...)
  }
}