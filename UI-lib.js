class Component {

	constructor(x, y, w, h) {

		if(x == undefined) x = 0;
		if(y == undefined) y = 0;
		if(w == undefined) w = 10;
		if(h == undefined) h = 10;

		this.setPos(x, y);
		this.setSize(w, h);

		this.inFocus = true;
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
	}

	setSize(w, h) {
		this.width = w;
		this.height = h;
	}

	render(g) {}

	resizeEvent(w, h) {
		this.setSize(w, h);
	}

	mouseMoved(x, y, px, py) {}
	mouseExited(x, y, px, py){}
	mouseDragged(x, y, px, py) {}
	mousePressed(x, y) {}
	mouseReleased(x, y) {}
	keyPressed() {}
	keyReleased() {}

}

class Label extends Component {

	constructor(text, tSize) {
		super();

		textSize(tSize);
		let size = this.calculateSize(text, tSize);
		this.setSize(size[0], size[1]);

		this.bgColor = color(0, 0, 0, 0);
		this.textSize = tSize;
		this.textColor = color(230);
		this.borderColor = 230;
		this.borderThickness = 1;
		this.text = text;
	}

	calculateSize(text, tSize){
		textSize(tSize);

		let lines = splitTokens(String(text), '\n');

		let width = 0;
		for(let line of lines){
			let lineWidth = textWidth(line);
			if(width < lineWidth){
				width = lineWidth;
			}

		}
		let height = (textAscent() + textDescent()) * lines.length;

		return [width * 1.1, height];
	}

	setText(t) {
		this.text = t;
		this.calculateSize(this.text, this.textSize);
	}

	render(g) {
		//Background
		if(this.bgColor != undefined) {
			g.fill(this.bgColor);
			g.rect(this.x, this.y, this.width, this.height)
		}

		//Text
		g.noStroke();
		g.fill(this.textColor);
		g.textSize(this.textSize);
		g.textAlign(CENTER, CENTER);
		g.text(this.text, this.x + this.width / 2, this.y + this.height / 2);

		//Borders
		g.stroke(this.borderColor);
		g.strokeWeight(this.borderThickness);
		g.noFill();
		g.rect(this.x, this.y, this.width, this.height);

	}

	setBackground(color) {
		this.bgColor = color;
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
		this.textSize = h;
	}

}

class Button extends Component {

	constructor(text, tSize) {
		textSize(tSize);
		let str = String(text);
		super(0, 0, textWidth(str) * 1.1, textAscent() + textDescent());

		this.text = text;
		this.textSize = tSize;

		colorMode(HSB);
		this.color = color(200, 180, 80);
		colorMode(RGB);

		this.pressing = false;
		this.hovering = false;

		this.on_press = function() {};
		this.on_hover = function() {};
		this.on_release = function() {};
	}

	render(g) {

		colorMode(HSB);
		let c;
		if(this.pressing) { // if pressing and hovering are both true this runs
			let b = brightness(this.color) * 0.9 - 3;
			let s = saturation(this.color) * 1;
			c = color(hue(this.color), s, b);
		} else if(this.hovering) {
			let b = brightness(this.color) * 1.1 + 5;
			let s = saturation(this.color) * 1;
			c = color(hue(this.color), s, b);
		} else {
			c = this.color;
		}

		// g.stroke(0);
		// g.strokeWeight(1);
		g.noStroke();
		g.fill(c);
		g.rect(this.x, this.y, this.width, this.height);
		colorMode(RGB);

		g.noStroke();
		g.textSize(this.textSize);
		g.fill(255);
		g.textAlign(CENTER, CENTER);
		g.text(this.text, this.x + this.width / 2, this.y + this.height / 2);
	}

	mousePressed(x, y) {
		this.pressing = true;
		this.requestRender();
		this.on_press();
	}

	mouseReleased(x, y) {
		this.pressing = false;
		this.requestRender();
	}

	mouseMoved(dx, dy) {
		if(this.hovering == false){
			this.requestRender();
		}
		this.hovering = true;
	}

	mouseExited(x, y, px, py){
		this.hovering = false;
		this.pressing = false;
		this.requestRender();
	}

	requestRender(){

	}

}

class Container extends Component {

	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.comps = [];
		this.itemCount = 0;
	}

	render(g) {
		for(const comp of this.comps) {
			comp.render(g);
		}
	}

	addItem(item) {
		this.itemCount++;
		this.comps.push(item);
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
		this.g = createGraphics(w, h);
	}

	mouseMoved(x, y, px, py) {
		for(let c of this.comps){
			if(c.x <= x && c.x + c.width > x
				&& c.y <= y && c.y + c.height > y){//first condition

					c.mouseMoved(x - c.x, y - c.y, px - c.x, py - c.y);

			}else if(c.x <= px && c.x + c.width > px
				&& c.y <= py && c.y + c.height > py){// If first condition is false

					c.mouseExited(x - c.x, y - c.y, px - c.x, py - c.y);

			}
		}
	}

	mouseExited(x, y, px, py){}

	mouseDragged(x, y, px, py) {
		for(let c of this.comps){
			if(c.x <= x && c.x + c.width > x
				&& c.y <= y && c.y + c.height > y){
					c.mouseDragged(x - c.x, y - c.y, px, py);
			}
		}
	}

	mousePressed(x, y) {
		for(let c of this.comps){
			if(c.x <= x && c.x + c.width > x
				&& c.y <= y && c.y + c.height > y){
					c.mousePressed(x - c.x, y - c.y);
			}
		}
	}

	mouseReleased(x, y) {
		for(let c of this.comps){
			if(c.x <= x && c.x + c.width > x
				&& c.y <= y && c.y + c.height > y){
					c.mouseReleased(x - c.x, y - c.y);
			}
		}
	}
	keyPressed() {}
	keyReleased() {}

}

class Layout extends Container {

	constructor(parent) {
		super(parent.x, parent.y, parent.width, parent.height);

		this.parent = parent;
		parent.setLayout(this);

	}

	render(g) {
		super.render(g);
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
	}

}

class ListLayout extends Layout {
	constructor(parent) {
		super(parent);

		this.xPadding = 20;
		this.yPadding = 20;
		this.nextItemPos = [this.xPadding, this.yPadding];
	}

	addItem(item) {
		super.addItem(item);
		this.calculatePosition();
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
		this.calculatePosition();
	}

	setPadding(x, y){
		this.xPadding = x;
		this.yPadding = y;
		this.calculatePosition();
	}
}

class VListLayout extends ListLayout {

	constructor(parent) {
		super(parent);
	}

	calculatePosition() {
		this.nextItemPos[1] = this.yPadding;
		for(const c of this.comps) {
			c.setPos(this.width / 2 - c.width / 2, this.nextItemPos[1]);
			this.nextItemPos[1] += c.height + this.yPadding;
		}

	}

	addItem(item) {
		super.addItem(item);
		this.calculatePosition();
	}
}

class HListLayout extends ListLayout {

	constructor(parent) {
		super(parent);
	}

	calculatePosition() {
		this.nextItemPos[0] = this.xPadding;
		for(const c of this.comps) {
			c.setPos(this.nextItemPos[0], this.height / 2 - c.height / 2);
			this.nextItemPos[0] += c.width + this.xPadding;
		}

	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
		this.calculatePosition();
	}

}

class GridLayout extends Layout {

	constructor(parent, c, r) { //Parent Component, columns, rows
		super(parent);

		this.rows = r;
		this.columns = c;

		this.numberOfCells = this.rows * this.columns;
		this.cells = [];
		for(let i = 0; i < this.numberOfCells; i++) {
			this.cells.push(false); //Empty
		}

		//  compsGridIndex[a]=index of the grid cell component is in. a = component's index in comps array)
		this.compsGridAtts = [];

		this.margin = 0;
		this.padding = 0;

		this.border = {
			show: true,
			color: color(150),
			thickness: 1.25
		};

		this.calculateGridSize();
	}

	addItem(c, x, y, w, h) { // Component, GridX, GridY, horizontal span, vertical span

		let index = y * this.columns + x; // index = which index the x,y denotes in the "cells" array
		let available = false; // if the required cells are empty

		if(arguments.length == 3) {

			if(this.checkIfOccupied(index) == false) { // if empty

				this.cells[index] = true; //occupied
				available = true;

			} else { // if the cell is occupied
				console.log('Grid cell is already occupied!');
			}

		} else if(arguments.length == 5) {

			let stack = [];

			loop:
				for(let i = 0; i < h; i++) {
					for(let j = 0; j < w; j++) {
						let cellX = x + j;
						let cellY = y + i;
						let index = cellX + cellY * this.columns;

						if(this.checkIfOccupied(index) == false) { // if not occupied
							stack.push(index);
						} else {
							break loop;
						}
					}
				}

			let area = w * h; // Area of the component in the grid
			if(stack.length == area) { // if all the required cells are empty
				for(let i = 0; i < area; i++) {
					this.cells[stack.pop()] = true; //occupy the cells
				}
				available = true;
			}

		} // end of (else if length == 5)

		if(available) {

			if(h == undefined) h = 1;
			if(w == undefined) w = 1;

			let cx = this.margin + (this.margin * 2 * x) + x * this.gridWidth; // component x
			let cy = this.margin + (this.margin * 2 * y) + y * this.gridHeight; //component y
			c.setPos(cx + this.padding, cy * this.padding);
			c.resizeEvent((this.margin * 2 * w) + (this.gridWidth * w) - this.padding * 2,
				(this.margin * 2 * h) + this.gridHeight * h) - this.padding * 2;
			super.addItem(c);

			this.compsGridAtts.push({
				cellIndex: index,
				gridX: x,
				gridY: y,
				hSpan: w,
				vSpan: h
			});

		}

	} // end of addItem()

	checkIfOccupied(i) {
		return this.cells[i];
	}

	resizeEvent(w, h) {
		this.setSize(w, h);
		this.calculateGridSize();

		for(let i = 0; i < this.itemCount; i++) {
			let xMarginOffset = this.margin + (this.margin * 2 * this.compsGridAtts[i].gridX);
			let yMarginOffset = this.margin + (this.margin * 2 * this.compsGridAtts[i].gridY);

			let xGridOffset = this.compsGridAtts[i].gridX * this.gridWidth;
			let yGridOffset = this.compsGridAtts[i].gridY * this.gridHeight;

			this.comps[i].setPos(this.padding + xMarginOffset + xGridOffset,
				this.padding + yMarginOffset + yGridOffset);

			let hSpan = this.compsGridAtts[i].hSpan;
			let vSpan = this.compsGridAtts[i].vSpan;

			this.comps[i].resizeEvent((this.gridWidth * hSpan) - 2 * this.padding + (hSpan - 1) * 2 * this.margin,
				(this.gridHeight * vSpan) - 2 * this.padding + (vSpan - 1) * 2 * this.margin);

		} //end of for loop

	} // end of resizeEvent()

	calculateGridSize() {
		//Grid size includes the padding
		this.gridWidth = (this.width / this.columns) - this.margin * 2;
		this.gridHeight = (this.height / this.rows) - this.margin * 2;
	}

	setMargin(m) {
		this.margin = m;
		this.calculateGridSize();
	}

	setPadding(p) {
		this.padding = p;
		this.resizeEvent(this.width, this.height);
	}

	render(g) {

		//display borders
		if(this.border.show == true) {
			//FOR EMPTY CELLS
			for(let i = 0; i < this.numberOfCells; i++) {
				if(this.cells[i] == false) { // if the cell is empty
					g.strokeWeight(this.border.thickness);
					g.stroke(this.border.color);
					g.noFill();
					// gridX and gridY values of the cell that has the 'i'th index in "cells[]"
					let gridX = i % this.columns;
					let gridY = floor(i / this.columns);
					// x and y values in this.g graphics object
					let x = this.margin + (this.margin * gridX * 2) + (gridX * this.gridWidth);
					let y = this.margin + (this.margin * gridY * 2) + (gridY * this.gridHeight);
					g.rect(x, y, this.gridWidth, this.gridHeight);
				}
			}

			//FOR OCCUPIED cells
			for(let i = 0; i < this.itemCount; i++) {

				//x and y values in this.g graphics object
				let x = this.margin + (this.margin * this.compsGridAtts[i].gridX * 2) +
					(this.compsGridAtts[i].gridX * this.gridWidth);
				let y = this.margin + (this.margin * this.compsGridAtts[i].gridY * 2) +
					(this.compsGridAtts[i].gridY * this.gridHeight);

				// width and the height of the border rectangle
				let hSpan = this.compsGridAtts[i].hSpan;
				let vSpan = this.compsGridAtts[i].vSpan;

				let w = hSpan * this.gridWidth + this.margin * 2 * (hSpan - 1);
				let h = vSpan * this.gridHeight + this.margin * 2 * (vSpan - 1);

				g.stroke(this.border.color);
				g.strokeWeight(this.border.thickness);
				g.noFill();
				g.rect(x, y, w, h);

			}

		}

		super.render(g);

	}

}

class Panel extends Component {

	constructor(w, h) {
		super(0, 0, w, h);

		this.layout;
		this.bgColor = color(20, 23, 30);
		this.titleBar = {
			show: false,
			minimumHeight: 25,
			height: 50,
			textColor: color(230),
			textSize: 30
		};

		this.g = createGraphics(this.width, this.height);

		new VListLayout(this);
	}

	render(g) {

		//Background
		this.g.noStroke();
		this.g.fill(this.bgColor);
		this.g.rect(0, this.layout.y, this.width, this.height);

		//Outline
		// this.g.noFill();
		// this.g.stroke(50);
		// this.g.strokeWeight(1);
		// this.g.rect(0, this.layout.y, this.width, this.height-this.layout.y);


		// Title Bar
		if(this.titleBar.show) {
			//Bar background
			this.g.noStroke();
			this.g.fill(this.bgColor);
			this.g.rect(0, 0, this.width, this.titleBar.height, 20, 20, 0, 0);

			//Bar outline
			// this.g.noFill();
			// this.g.stroke(100);
			// this.g.strokeWeight(1);
			// this.g.rect(0, 0, this.width, this.titleBar.height - 1, 20, 20, 0, 0);
			// this.g.stroke(50);
			// this.g.line(0, this.titleBar.height, this.width, this.titleBar.height);

			//Text
			this.g.fill(this.titleBar.textColor);
			this.g.textSize(this.titleBar.textSize);
			this.g.textAlign(LEFT, BOTTOM);
			this.g.text(this.titleBar.title, 10, this.titleBar.height);
		}

		//Contents
		this.g.push();
		this.g.translate(this.layout.x, this.layout.y);
		this.layout.render(this.g);
		this.g.pop();

		g.image(this.g, this.x, this.y);

	}

	setLayout(layout) {
		if(this.layout != undefined){
			let layoutPos = [this.layout.x, this.layout.y];
			this.layout = layout;
			this.layout.x = layoutPos[0];
			this.layout.y = layoutPos[1];
		}else{
			this.layout = layout;
		}
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);

		this.g = createGraphics(w, h);

		if(this.titleBar.show == false || this.titleBar.height == undefined) {
			this.layout.resizeEvent(w, h);
		} else {
			this.layout.resizeEvent(w, h - this.titleBar.height);
		}

	}

	addItem(item) {
		this.layout.addItem(item);
	}

	setTitle(title) {
		this.titleBar.show = true;

		this.titleBar.title = title;

		if(this.height/17 < this.titleBar.minimumHeight) {
			this.titleBar.height = this.titleBar.minimumHeight;
		} else {
			this.titleBar.height = this.height/17;
		}

		this.titleBar.textSize = this.titleBar.height - 5;

		this.layout.setPos(this.layout.x, this.titleBar.height);
	}

	setBackground(color) {
		this.bgColor = color;
	}

	mouseMoved(x, y, px, py) {
		if(this.layout != undefined && y > this.layout.y) {
			this.layout.mouseMoved(x - this.layout.x, y - this.layout.y,
				 px - this.layout.x, py - this.layout.y);
		}
	}

	mouseExited(x, y, px, py){
		this.layout.mouseExited(x - this.layout.x, y - this.layout.y,
			px - this.layout.x, py - this.layout.y);
	}

	mouseDragged(x, y, px, py) {
		if(this.layout != undefined && y > this.layout.y) {
			this.layout.mouseDragged(x - this.layout.x, y - this.layout.y , px, py);
		}
	}

	mousePressed(x, y) {
		if(this.layout != undefined && y > this.layout.y) {
			this.layout.mousePressed(x - this.layout.x, y - this.layout.y);
		}
	}

	mouseReleased(x, y) {
		if(this.layout != undefined && y > this.layout.y) {
			this.layout.mouseReleased(x - this.layout.x, y - this.layout.y);
		}
	}

}

// This class is responsible for mouse and key events
// Should only be one MainPanel in a sketch
class MainPanel extends Panel {


	constructor(w, h) {
		super(w, h);

		super.bgColor = color(10, 10, 10);
		this.preMousePressed = false;
		this.shouldRender = true;
	}

	loop(g) {

		// Mouse Input Events
		let prx = pmouseX - this.x;
		let pry = pmouseY - this.y;

		let rx = mouseX - this.x; // rx --> relative x
		let ry = mouseY - this.y;

		if((mouseX != pmouseX || mouseY != pmouseY)) {
			this.mouseMoved(rx, ry, prx, pry);
		}
		if(mouseIsPressed && (mouseX != pmouseX || mouseY != pmouseY)) {
			this.mouseDragged(rx, ry, prx, pry);
		}
		if(mouseIsPressed && !this.preMousePressed) {
			this.mousePressed(rx, ry);
		}
		if(!mouseIsPressed && this.preMousePressed) {
			this.mouseReleased(rx, ry);
		}

		this.preMousePressed = mouseIsPressed;

		//Rendering
		this.shouldRender = true;
		if(this.shouldRender){
			this.render(g);
		}

	}

	keyPressed() {
		for(let c of this.layout.comps) {
			if(c.inFocus) c.keyPressed();
		}
	}

	keyReleased() {
		for(let c of this.layout.comps) {
			if(c.inFocus) c.keyReleased();
		}
	}

	render(g){
		super.render(g);
		this.shouldRender = false;
	}

}
