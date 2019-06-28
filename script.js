var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var gravity = .04;
var gap     = 100;
var GameSpeed   = 1;
var lost = false;

var xSol = 0;
var xBack = 0;
var Score = 0;
ctx.lineWidth = 5;

if(!localStorage.FBHS){
	localStorage.FBHS = 0;
}

coin = new Audio('sounds/coin.mp3');
flap = new Audio('sounds/flap.mp3');
paf  = new Audio('sounds/paf.mp3');
var birdN = new Image();
birdN.src = 'img/birdN.png';
var birdH = new Image();
birdH.src = 'img/birdH.png';
var birdB = new Image();
birdB.src = 'img/birdB.png';
var img2 = new Image();
img2.src = 'img/sol.png';
var up = new Image();
up.src = 'img/up.png';
var fond = new Image();
fond.src = 'img/fond.png';

fond.onload = function(){
	jeu = setInterval(update, 1);
}

var obstacles = [];
var birds     = [];

function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawFloor(){
	ctx.globalAlpha = 1;
	if(xSol<=-250){
		xSol = 0;
	}else{
		xSol -= GameSpeed;
	}
	ctx.drawImage(img2, xSol, canvas.height-50, 250, 50);
	ctx.drawImage(img2, xSol+250, canvas.height-50, 250, 50);
	ctx.drawImage(img2, xSol+500, canvas.height-50, 250, 50);
	ctx.drawImage(img2, xSol+750, canvas.height-50, 250, 50);
	ctx.drawImage(img2, xSol+1000, canvas.height-50, 250, 50);
}

function drawBackground(){
	ctx.globalAlpha = 1;
	if(xBack<=-638){
		xBack = 0;
	}else{
		xBack -= GameSpeed*0.3;
	}
	ctx.drawImage(fond, xBack, canvas.height-50-300, 638, 300);
	ctx.drawImage(fond, xBack+638, canvas.height-50-300, 638, 300);
	ctx.drawImage(fond, xBack+1276, canvas.height-50-300, 638, 300);
}

function drawScore(){
	ctx.font = "40px Windows";
	ctx.fillStyle = "#333";
	ctx.fillText(Score, 10, 35);


	ctx.font = "30px Windows";
	ctx.fillStyle = "#b2ac73";
	ctx.fillText("Highscore : " + localStorage.FBHS, 10,canvas.height-10);
}

function update(){
	clear();
	drawBackground();
	for (var i = 0; i<birds.length; i++) {
		birds[i].move();
		birds[i].draw();
	}
	for (var i = 0; i<obstacles.length; i++) {
		obstacles[i].move();
		obstacles[i].draw();
		if((obstacles[i].x < birds[0].x + 40 && obstacles[i].x + 50 > birds[0].x) && ((birds[0].y + 40 > obstacles[i].random + gap)||(birds[0].y + 5 < obstacles[i].random))){
			if(!lost){
				paf.volume = 0.6;
				paf.play();
				birds[0].ySpeed = 0;
			}
			lost = true;
			GameSpeed = 0;
			setTimeout(function(){
				clearInterval(jeu);
			},1000);
		}
	}
	if(obstacles.length == 0 || last.x < canvas.width - 220){
		last = new Obstacle();
		obstacles.push(last);
	}
	if(obstacles[0].x == 100){
		Score++;
		localStorage.FBHS = (localStorage.FBHS < Score) ? Score : localStorage.FBHS;
		coin.currentTime = 0;
		coin.volume = 0.4;
		coin.play();
	}
	drawFloor();
	drawScore();
	
}

function Bird(){
	this.ySpeed = -2;
	this.x = 100;
	this.y = canvas.height/2 - 50;
	
	this.move = function(){
		this.ySpeed += gravity;
		this.y += this.ySpeed;
		if(this.y + 33 >= canvas.height - 50){
			this.y = canvas.height - 50 - 33;
		}
	}

	this.draw = function(){
		ctx.globalAlpha = 1;
		if(this.ySpeed < 0){ // Monte
			ctx.drawImage(birdH, this.x, this.y, 40, 40);
		}else if(this.ySpeed > 2 && this.y < canvas.height-50-40){ // Tombe
			ctx.drawImage(birdB, this.x, this.y, 40, 40);
		}else{ // Normal
			ctx.drawImage(birdN, this.x, this.y, 40, 40);
		}
	}
}

function Obstacle(){
	this.xSpeed = -1;
	this.x = canvas.width;
	this.y = 0;
	this.random = Math.random()*230+10;
	this.color = "#0f4";

	this.move = function(){
		this.x += this.xSpeed*GameSpeed;
		if(this.x + 100 < 0){
			obstacles.splice(0, 1);
		}
	}

	this.draw = function(){
		ctx.beginPath();
      	ctx.moveTo(this.x,this.random);
      	ctx.lineTo(this.x + 60,this.random);
      	ctx.stroke();
      	ctx.moveTo(this.x,this.random + gap);
      	ctx.lineTo(this.x + 60,this.random + gap);
      	ctx.stroke();
      	ctx.closePath();
		ctx.globalAlpha = 1;
		ctx.drawImage(up, this.x, this.y, 60, this.random);
		ctx.drawImage(up, this.x, this.random + gap, 60, canvas.height - 50);
	}
}

document.onmousedown = function(){
	if(!lost){
		birds[0].ySpeed = -2;
		flap.volume = 0.4;
		flap.currentTime = 0;
		flap.play();
	}else{
		flap.volume = 0.4;
		flap.currentTime = 0;
		flap.play();
		lost = false;
		obstacles = [];
		birds = [];
		birds.push(new Bird());
		GameSpeed = 1;
		Score = 0;
		jeu = setInterval(update, 1);
	}
}

// document.onkeydown = function(){
// 	birds[1].ySpeed = -2;	
// }


birds.push(new Bird());

last = new Obstacle();
obstacles.push(last);
