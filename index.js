function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent(document.querySelector("#game"));
  noStroke();
}

function draw() {
  background("green");
  ellipse(mouseX, mouseY, 30);
}
