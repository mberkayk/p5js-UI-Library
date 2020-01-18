let mainPanel;
let grid;

let p0, p1, p2, p3; // panel 0 to 3

let gr;

let hlayout;

function setup(){
  createCanvas(600, 600);
  noLoop();

  gr = createGraphics(600, 600);

  mainPanel = new Panel(0, 0, width, height);
  grid = new GridLayout(mainPanel, 3, 2);
  mainPanel.setTitle('Main Panel');

  p0 = new Panel(300, 300);
  p1 = new Panel(200, 200);
  p2 = new Panel(30, 30);

  //hlayout = new HListLayout(p2);

  p2.addItem(new Label('second label', 40));
  p2.addItem(new Label('asdf', 30));

  p0.setTitle('First Panel');
  p1.setTitle('Second Panel');
  p2.setTitle('Third Panel');

  p0.setBackground(color(200,120,0));
  p1.setBackground(color(255));
  p2.setBackground(color(125, 200, 40));

  grid.addItem(p0, 0, 0, 2, 1);
  grid.addItem(p1, 2, 0);
  grid.addItem(p2, 0, 1, 3, 1);

  p0.addItem(new Label(p0.titleBar.height, 30));
  p0.addItem(new Label(p1.titleBar.height, 30));
  p0.addItem(new Label(p2.titleBar.height, 30));
  p0.addItem(new Label('hey', 15));

  grid.setMargin(15);
  grid.setPadding(10);

  //mainPanel.addItem(p0);
  //mainPanel.addItem(p1);

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
