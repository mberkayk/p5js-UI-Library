let mainPanel;
let grid;

let gr; //graphics

let p0;
let p1;
let p2;

function setup() {
	createCanvas(600, 600);
	frameRate(500);

	gr = createGraphics(width, height);
	mainPanel = new MainPanel(width, height);
	grid = new GridLayout(mainPanel, 3, 2);
	mainPanel.setTitle('Main Panel (With Grid Layout)');

	p0 = new Panel(300, 300);
	p1 = new Panel(200, 200);
	p2 = new Panel(1000, 300);

	p0.setTitle('Panel With Vertical List Layout');
	p2.setTitle('Panel With Horizontal List Layout');

	p0.addItem(new Label(p0.titleBar.height, 30));
	p0.addItem(new Label(p1.titleBar.height, 30));
	p0.addItem(new Label(p2.titleBar.height, 30));

	p1.layout.setPadding(0, 50);
	p1.addItem(new Label('This panel\ndoesn\'t have a\ntitle bar', 14));

	let p2layout = new HListLayout(p2);

	let p2panel0 = new Panel(250, 200);
	let p2panel1 = new Panel(250, 200);

	p2panel0.setTitle('Inner Panel 1');

	p2panel0.addItem(new Label('label 1', 15));

	let btn0 = new Button('button 1', 15);
	btn0.on_press = btn0Press;
	p2panel0.addItem(btn0);

	p2panel1.setTitle('Inner Panel 2');

	p2panel1.addItem(new Label('label 2', 20));

	let btn1 = new Button('button 2', 20);
	btn1.on_press = btn1Press;
	p2panel1.addItem(btn1);

	p2layout.addItem(p2panel0);

	p2layout.addItem(p2panel1);

	grid.addItem(p0, 0, 0, 2, 1);
	grid.addItem(p1, 2, 0);
	grid.addItem(p2, 0, 1, 3, 1);

	grid.setMargin(15);
	grid.setPadding(10);

	grid.border.show = false;
}

function draw() {
	mainPanel.loop(gr);
	image(gr, 0, 0);
}

function windowResized() {
	mainPanel.resizeEvent(width, height);
}

function btn0Press() {
	print('btn0');
}
function btn1Press() {
	print('btn1');
}

// function setup() {
// 	createCanvas(600, 600);
// 	frameRate(500);
//
// 	gr = createGraphics(width, height);
// 	mainPanel = new MainPanel(width, height);
//
// 	mainPanel.setTitle('asdf');
//
// 	panel1 = new Panel(100, 600);
// 	panel1.setTitle('title 1');
// 	panel1.setBackground(color(20, 0, 21));
// 	panel1.addItem(new Label("hsdag", 32));
// 	panel2 = new Panel(300, 100);
// 	panel2.setTitle('2');
// 	panel2.titleBar.shape.fillColor = color(255,0 ,0);
// 	panel2.setBackground(color(0, 40, 21));
//
// 	grid = new GridLayout(mainPanel,2,1);
// 	grid.addItem(panel1, 0, 0);
// 	grid.addItem(panel2, 1, 0);
// 	mainPanel.setLayout(grid);
// }
//
// function draw(){
// 	mainPanel.loop(gr);
// 	image(gr, 0, 0);
// }
