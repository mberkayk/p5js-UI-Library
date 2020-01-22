let mainPanel;
let grid;

let gr; //graphics

let p0;
let p1;
let p2;

function setup() {
	createCanvas(600, 600);

	gr = createGraphics(600, 600);

	mainPanel = new MainPanel(0, 0, width, height);
	grid = new GridLayout(mainPanel, 3, 2);
	mainPanel.setTitle('Main Panel');

	p0 = new Panel(300, 300);
	p1 = new Panel(200, 200);
	p2 = new Panel(30, 30);

	p0.setTitle('First Panel');
	p1.setTitle('Second Panel');
	p2.setTitle('Third Panel');

	p0.setBackground(color(200, 120, 0));
	p1.setBackground(color(255));
	p2.setBackground(color(125, 200, 40));

	p0.addItem(new Label(p0.titleBar.height, 30));
	p0.addItem(new Label(p1.titleBar.height, 30));
	p0.addItem(new Label(p2.titleBar.height, 30));
	p0.addItem(new Label('hey', 15));

	let p2layout = new GridLayout(p2, 2, 1);
	p2layout.setPadding(10);
	let p2panel0 = new Panel(150, 200);
	p2panel0.setTitle('panel 1');
	let p2panel1 = new Panel(150, 100);
	p2panel1.setTitle('panel 2');

	p2panel0.addItem(new Label('label 1', 15));
	let btn0 = new Button('button 1', 15);
	btn0.on_press = btn0Press;
	p2panel0.addItem(btn0);
	p2panel1.addItem(new Label('label 2', 20));
	let btn1 = new Button('button 2', 20);
	btn1.on_press = btn1Press;
	p2panel1.addItem(btn1);

	p2layout.addItem(p2panel0, 0, 0);
	p2panel0.setBackground(color(50, 30, 120));
	p2layout.addItem(p2panel1, 1, 0);
	p2panel1.setBackground(color(50, 30, 120));

	grid.addItem(p0, 0, 0, 2, 1);
	grid.addItem(p1, 2, 0);
	grid.addItem(p2, 0, 1, 3, 1);

	grid.setMargin(15);
	grid.setPadding(10);

	mainPanel.setBackground(color(30, 30, 40));

	mainPanel.resizeEvent(600, 600);
}

function draw() {
	mainPanel.loop();
	mainPanel.render(gr);
	image(gr, 0, 0);
}

function windowResized() {
	mainPanel.resizeEvent(width, height);
}

function btn0Press(){
	print('btn0');
}
function btn1Press(){
	print('btn1');
}
