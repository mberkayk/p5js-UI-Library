

let panel;
let g;
let b;

function setup(){

  createCanvas(400, 400);
  frameRate(100);

  panel = new Panel(0, 0, width, height);
  g = createGraphics(width, height);

  b = new Button(30, 30, 100, 80, "asd");
  b.on_press = printThings;
  panel.addItem(b);
}

function draw(){
  background(125);

  panel.render(g);
  image(g, 0, 0);

  if(mouseX < b.x || mouseX > b.x+b.width || mouseY < b.y || mouseY > b.y+b.height){
    b.pressing = false;
    b.hovering = false;
  }else {
    if(mouseIsPressed){
      b.pressing = true;
      b.hovering = false;
    } else {
      b.pressing = false;
      b.hovering = true;
    }
  }
}

function printThings(){
  print("Hallelujah!");
}
