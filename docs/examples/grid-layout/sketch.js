

let mainPanel;
let grid;

let p0, p1, p2, p3; // panel 0 to 3

let gr;

function setup(){
  createCanvas(600, 600);

  gr = createGraphics(600, 600);

  mainPanel = new Panel(0, 0, width, height);
  grid = new GridLayout(mainPanel, 2, 2);
  mainPanel.setTitle('Main Panel');

  p0 = new Panel(0, 0, 300, 300);
  p1 = new Panel(0, 0, 200, 200);
  p2 = new Panel(0, 0, 30, 30);
  p3 = new Panel(0, 0, 30, 30);

  p0.setTitle('First Panel');
  p1.setTitle('Second Panel');
  p2.setTitle('Third Panel');
  p3.setTitle('Fourth Panel');
  p0.setBackground(color(200,120,0));
  p1.setBackground(color(255));
  p2.setBackground(color(125, 200, 40));
  p3.setBackground(color(90, 120, 210));

  p0.addItem(new Label('LABEL', 15, 15, 100, 30));
  p0.addItem(new Label('second', 100, 10, 150, 30));

  grid.addItem(p0, 0, 0);
  grid.addItem(p1, 1, 0);
  grid.addItem(p2, 0, 1);
  grid.addItem(p3, 1, 1);

  grid.setMargin(5);
  //grid.setPadding(5);


  mainPanel.setBackground(color(30, 30, 40));

  mainPanel.resizeEvent(600, 600);
}

function draw(){
  mainPanel.render(gr);
  image(gr, 0, 0);
}

function windowResized(){
  mainPanel.resizeEvent(width, height);
}
