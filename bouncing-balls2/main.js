// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
   x;
   y;
   velX;
   velY;
   color;
   size
   constructor(x, y, velX, velY, color, size) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
   }
   draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
   }

}


class Ball extends Shape {

   constructor(x,y,velX,velY,color,size){
      super(x,y,velX,velY,color,size)
   }

   update() {
      if ((this.x + this.size) >= width) {
         this.velX = -(this.velX);
      }

      if ((this.x - this.size) <= 0) {
         this.velX = -(this.velX);
      }

      if ((this.y + this.size) >= height) {
         this.velY = -(this.velY);
      }

      if ((this.y - this.size) <= 0) {
         this.velY = -(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
   }

   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball)) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
         }
      }
   }

}


class evilBall extends Shape{
   constructor(x,y,velX,velY,color,size){
      super(x,y,velX,velY,color,size)
   }
   update(){
   }
   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball)) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              balls.splice(balls.indexOf(ball),1)
            }
         }
      }
   }

}

const evilball = new evilBall(
   random(0 + 50,width - 50),
   random(0 + 50,height - 50),
   0,
   0,
   'white',
   50
)

const balls = [];

while (balls.length < 25) {
   const size = random(10,20);
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
}

function checkRemainingBalls(){
   let remainingBalls = balls.length
   const remainingHeader = document.querySelector('h2')
   remainingHeader.textContent = 'ball count: ' + remainingBalls 
}
document.addEventListener('keydown', e => {
   switch(e.code){
      case 'ArrowRight':
         if(evilball.x + evilball.size < width ){
         evilball.x = evilball.x + 30
         }
         break
      case 'ArrowLeft':
         if(evilball.x - evilball.size > 0){
         evilball.x = evilball.x - 30
         }
         break
      case 'ArrowUp':
         if(evilball.y - evilball.size > 0 ){
         evilball.y = evilball.y - 30
         }
         break
      case 'ArrowDown':
         if(evilball.y + evilball.size < height){
         evilball.y = evilball.y + 30
         }
         break
   }
})


function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   for (const ball of balls) {
     ball.draw();
     ball.update();
     ball.collisionDetect();

   }
   checkRemainingBalls();
   evilball.draw()
   evilball.collisionDetect()
   requestAnimationFrame(loop);
}

loop();