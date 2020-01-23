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

	mouseMoved(dx, dy) {}
	mouseDragged(dx, dy) {}
	mousePressed(x, y) {}
	mouseReleased(x, y) {}
	keyPressed() {}
	keyReleased() {}

}

class Label extends Component {

	constructor(text, tSize) {
		textSize(tSize);
		let str = String(text);
		super(0, 0, textWidth(str) * 1.1, textAscent() + textDescent());

		this.bgColor = color(0, 0, 0, 0);
		this.textSize = tSize;
		this.textColor = color(0);
		this.text = text;
	}

	setText(t) {
		this.text = t;
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
		g.stroke(0);
		g.strokeWeight(1);
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
		this.color = color(200, 80, 80);
		colorMode(RGB);

		this.pressing = false;
		this.hovering = false;

		this.on_press = function() {};
		this.on_hover = function() {};
		this.on_release = function() {};
	}

	render(g) {

		g.colorMode(HSB);
		let c;
		if(this.pressing) {
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

		g.stroke(0);
		g.strokeWeight(1);
		g.fill(c);
		g.rect(this.x, this.y, this.width, this.height);
		g.colorMode(RGB);

		g.noStroke();
		g.textSize(this.textSize);
		g.fill(0);
		g.textAlign(CENTER, CENTER);
		g.text(this.text, this.x + this.width / 2, this.y + this.height / 2);
	}

	mousePressed(x, y) {
		this.pressing = true;
		this.on_press();
	}

	mouseReleased() {
		this.pressing = false;
	}

	mouseMoved(dx, dy) {
		this.hovering = true;
	}

	setPos(x, y) {
		super.setPos(x, y);
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

		this.showBorders = true;

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
		if(this.showBorders == true) {
			//FOR EMPTY CELLS
			for(let i = 0; i < this.numberOfCells; i++) {
				if(this.cells[i] == false) { // if the cell is empty
					g.strokeWeight(1.5);
					g.stroke(0);
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

				g.stroke(0);
				g.strokeWeight(1);
				g.noFill();
				g.rect(x, y, w, h);

			}

		}

		super.render(g);

	}

	mousePressed(x, y) {
		for(let i = 0; i < this.itemCount; i++) {

			if(x >= this.comps[i].x && x < this.comps[i].x + this.comps[i].width) {
				if(y >= this.comps[i].y && y < this.comps[i].y + this.comps[i].height) {
					this.comps[i].mousePressed(x, y);
				}
			}

		}
	}

}

class Panel extends Component {

	constructor(w, h) {
		super(0, 0, w, h);

		this.layout;
		this.bgColor;
		this.titleBar = {
			minimumHeight: 30,
			height: 50
		};

		this.g = createGraphics(this.width, this.height);

		new VListLayout(this);
	}

	render(g) {

		if(this.bgColor != undefined) {
			//this.g.background(this.bgColor);
			this.g.noStroke();
			this.g.fill(this.bgColor);
			if(this.titleBar.title != undefined) {
				this.g.rect(0, this.titleBar.height, this.width, this.height);
			} else {
				this.g.rect(0, 0, this.width, this.height);
			}
		}

		if(this.titleBar.title != undefined) {
			//Bar background
			this.g.fill(170);
			this.g.rect(0, 0, this.width, this.titleBar.height, 20, 20, 0, 0);

			//Bar outline
			this.g.noFill();
			this.g.stroke(100);
			this.g.rect(0, 0, this.width, this.titleBar.height - 1, 20, 20, 0, 0);
			this.g.stroke(50);
			this.g.line(0, this.titleBar.height, this.width, this.titleBar.height);
			//Text
			this.g.fill(0);
			this.g.textSize(this.width / 30);
			this.g.textAlign(CENTER, TOP);
			this.g.text(this.titleBar.title, this.width / 2, this.titleBar.height / 5);

			//contents
			this.g.push();
			this.g.translate(this.layout.x, this.layout.y);
			this.layout.render(this.g);
			this.g.pop();
		} else { // If there isn't a title bar
			this.layout.render(this.g);
		}

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

		if(this.titleBar.height == undefined) {
			this.layout.resizeEvent(w, h);
		} else {
			this.layout.resizeEvent(w, h - this.titleBar.height);
		}

	}

	addItem(item) {
		this.layout.addItem(item);
	}

	setTitle(title) {
		this.titleBar.title = title;
		if(this.height < this.titleBar.minimumHeight * 9) {
			this.titleBar.height = this.titleBar.minimumHeight;
		} else {
			this.titleBar.height = 20;
		}
		this.layout.setPos(this.layout.x, this.titleBar.height);
	}

	setBackground(color) {
		this.bgColor = color;
	}

	mousePressed(x, y) {
		if(this.layout != undefined) {
			this.layout.mousePressed(x, y);
		}
	}

}

class MainPanel extends Panel {

	constructor(w, h) {
		super(w, h);

		this.preMousePressed = false;
	}

	resizeEvent(w, h){
		super.resizeEvent(w, h);
	}

	loop() {

		if((mouseX != pmouseX || mouseY != pmouseY) && !mouseIsPressed) {
			for(let c of this.layout.comps) {
				c.mouseMoved(mouseX - pmouseX, mouseY - pmouseY);
			}
		}
		// mouse dragged
		if(mouseIsPressed && (mouseX != pmouseX || mouseY != pmouseY)) {
			for(let c of this.layout.comps) {
				c.mouseDragged(mouseX - pmouseX, mouseY - pmouseY);
			}
		}
		if(mouseIsPressed && !this.preMousePressed) {
			for(let c of this.layout.comps) {
				c.mousePressed(mouseX - c.x, mouseY - c.y);
			}
		}
		if(!mouseIsPressed && this.preMousePressed) {
			for(let c of this.layout.comps) {
				c.mouseReleased(mouseX - c.x, mouseY - c.y);
			}
		}

		this.preMousePressed = mouseIsPressed;
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

}
