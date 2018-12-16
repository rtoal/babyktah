class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

class Player extends Character {
  constructor(x, y, color, radius, speed) {
    super(x, y, color, radius, speed);
    this.health = 100;
  }
  takeHit() {
    player.heath -= 1;
  }
  powerUp() {
    // Someday powerups should be implemented.
    this.health = Math.max(100, this.health + 25);
  }
}

const player = new Player(30, 30, "blue", 10, 0.05);
const enemies = [
  new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
  new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
  new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
  new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
let scarecrow;

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent(document.querySelector("#game"));
  noStroke();
}

function draw() {
  background("lightgreen");
  [player, ...enemies].forEach(character => character.draw());
  player.move({x: mouseX, y: mouseY});
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  processScarecrow();
  handleCollisions();
  addEnemies();
  updateHealthBar();
  checkForGameOver();
}

function processScarecrow() {
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
}

function handleCollisions() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i+1; j < characters.length; j++) {
      pushOffIfNecessary(characters[i], characters[j]);
    }
  }
}

function pushOffIfNecessary(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    const adjustX = (overlap / 2) * (dx / distance);
    const adjustY = (overlap / 2) * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
    if (c1 === player) {
      player.health--;
    }
  }
}

function addEnemies() {
  if (frameCount % 600 === 0) {
    enemies.push(new Character(800, 400, "rgb(70,125,29)", 17, 0.02));
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}

function updateHealthBar() {
  document.querySelector("progress").value = player.health;
}

function checkForGameOver() {
  if (player.health <= 0) {
    textAlign(CENTER);
    textFont("chalkduster");
    textSize(60);
    fill("red");
    text('GAME OVER', width / 2, height / 2);
    noLoop();
  }
}
