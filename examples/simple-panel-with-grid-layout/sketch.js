

let mainPanel;
let grid;

let p0, p1, p2, p3; // panel 0 to 3

function setup(){
  size(600, 600);

  mainPanel = new Panel(0, 0, width, height);
  grid = new GridLayout(mainPanel, 2, 2);

  p0 = new Panel();
  p1 = new Panel();
  p2 = new Panel();
  p3 = new Panel();

  p0.setTitle('First Panel');
  p1.setTitle('Second Panel');
  p2.setTitle('Third Panel');
  p3.setTitle('Fourth Panel');

  grid.addItem(p0, 0, 0);
  grid.addItem(p1, 1, 0);
  grid.addItem(p2, 0, 1);
  grid.addItem(p3, 1, 1);

}

function draw(){


}
