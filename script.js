let laser = new Audio("./laser.mp3")

//board

let tileSize = 32;
let rows = 16;
let colums = 16;

let board;
let boardWidth = tileSize * colums;
let boardHeight = tileSize * rows;
let context;

//ship

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let ShipX = tileSize * colums/2 - tileSize;
let ShipY = tileSize * rows - tileSize*2;
let shipImg;
let shipVelocityX = tileSize;

let ship = {
    x : ShipX,
    y : ShipY,
    width : shipWidth,
    height : shipHeight
}

let alienArray = [];
let alienX = tileSize;
let alienY = tileSize;
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienImg;
let randomAlienImg = ["./alien.png", "./alien-cyan.png", "./alien-magenta.png", "./alien-yellow.png" ]
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1; //alien moving speed

function createAliens(){
    for(let c = 0; c < alienColumns; c++){
        for(let r = 0; r < alienRows; r++){
            let randomImg = new Image();
            randomImg.src = randomAlienImg[Math.floor(Math.random() * randomAlienImg.length)];
            let health = 1;
            if(randomImg.src.includes("yellow" )){
                health = 2
            }
            let alien = {
                img : randomImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true,
                health : health

            }
            alienArray.push(alien)
        }
    }
    alienCount = alienArray.length
}


window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //draw ship

    shipImg = new Image();
    shipImg.src ="./ship.png"
    shipImg.onload = function (){
        context.drawImage(shipImg ,ship.x ,ship.y ,ship.width ,ship.height)
    }
    
    alienImg = new Image();
    alienImg.src = randomAlienImg[Math.floor(Math.random() * randomAlienImg.length)];
    createAliens();
}

requestAnimationFrame(update);
document.addEventListener("keydown", moveShip);
document.addEventListener("keyup", shoot)

function update(){
    if(gameOver){
        return;
    }
    requestAnimationFrame(update)
    context.clearRect(0,0, board.width, board.height)
    //ship
    context.drawImage(shipImg ,ship.x ,ship.y ,ship.width ,ship.height)
    //alien
    for(i=0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if(alien.alive){
            alien.x += alienVelocityX;
            

            if(alien.x + alien.width >= board.width || alien.x <= 0){
                  alienVelocityX*=-1;
                  alien.x += alienVelocityX*2;

            for(let j = 0; j < alienArray.length; j++){
               alienArray[j].y += alienHeight;
            }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height)
             
            if(alien.y >= ship.y){
                gameOver =true;
            }
        
        }

    }
    for(i=0; i<bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white"
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    // bullet collision with aliens
    for(let j = 0; j<alienArray.length; j++){
        let alien = alienArray[j];
        if(!bullet.used && alien.alive && detectCollision(bullet, alien)){
            bullet.used = true;
            alien.health--;
            if(alien.img.src.includes("alien-yellow.png") && (alien.health == 1)){
                alien.img.src = "./angry-yellow.png"
            }
            if(alien.health <= 0){
                alien.alive = false;
                alienCount--;
                score += 100;
            }
           
            
        }
    }
    
}
    while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
        bulletArray.shift()
    }
     // next level
    if(alienCount == 0){
        // increase number of aliens in columns by 1
      alienColumns = Math.min(alienColumns + 1, colums/2 -2);
      alienRows = Math.min(alienRows + 1, rows - 4);
      alienVelocityX += 0.2
      alienArray = [];
      bulletArray = [];
      createAliens();
    }
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);

}
    
function moveShip(e){
    if(gameOver){
        return;
    }
    if(e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0){
        ship.x -= shipVelocityX
    }
    else if(e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width){
        ship.x += shipVelocityX
    }
}

//aliens

//bullets
let bulletArray = [];
let bulletVelocityY = -10

let score = 0;
let gameOver = false;

function shoot(e){
    if(gameOver){
        return;
    }
    if(e.code == "Space"){
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        laser.currentTime = 0;
        laser.play();
      bulletArray.push(bullet)
    }

}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + b.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;

}