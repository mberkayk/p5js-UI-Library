class Shape {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.scale = 1;
		this.offset = [0, 0];
		this.fillColor = color(0, 0, 0, 0);
		this.strokeWeight = 1;
		this.strokeColor = color(0);
		this.type;

		this.flaggedForRender = true;
	}

	translate(x, y){
		this.offset[0] += x;
		this.offset[1] += y;
	}

	setOffset(x, y){
		this.offset = [x, y];
	}

	setScale(s){
		this.scale = s;
	}

	flagForRender(){
		this.flaggedForRender = true;
	}

}

class Rect extends Shape{
	constructor(x, y, w, h){
		super(x, y);
		this.width = w;
		this.height = h;
		this.type = 'rect';
	}
}

class Ellipse extends Shape {
	constructor(x, y, w, h){
		super(x, y);
		this.width = w;
		this.height = h;
		this.type = 'ellipse';
	}
}

class Line extends Shape {
	constructor(x, y, x1, y1){
		super(x, y);
		this.x1 = x1;
		this.y = y1;
	}
}

class Text extends Shape {
	constructor(text, x, y, size){
		super(x, y);
		this.height = size;
		this.text = text;
		this.type = 'text';
		this.alignH = LEFT;
		this.alignV = TOP;

		this.fillColor = color(255);
		this.strokeWeight = 0;
		textSize(this.height)
		// this.width = textWidth(text);
	}

	setColor(c){
		this.color = c;
	}

	setAlignment(h, v){
		this.alignH = h;
		this.alignV = v;
	}
}

class SVGraphics {
	constructor(){
		this.gElements = []; // Graphical Elements
	}

	add(element){
		this.gElements.push(element);
	}

	addArray(arr){
			for(let i = 0; i < arr.length; i++){
				this.gElements.push(arr[i]);
			}
	}

	renderElement(g, e){
		g.push();
		g.fill(e.fillColor);
		g.strokeWeight(e.strokeWeight);
		g.stroke(e.strokeColor);
		g.scale(e.scale);
		g.translate(e.offset[0], e.offset[1]);

		if(e.type == 'rect'){
			g.rect(e.x, e.y, e.width, e.height);
		}else if(e.type == 'ellipse'){
			g.ellipse(e.x, e.y, e.width, e.height);
		}else if(e.type == 'line'){
			g.line(e.x, e.y, e.x1, e.y1);
		}else if(e.type == 'text'){
			g.textSize(e.height);
			g.textAlign(e.alignH, e.alignV);
			g.text(e.text, e.x, e.y);
		}

		g.pop();
	}

	renderAllEvenIfNotFlagged(g){
		for(let e of this.gElements){
			this.renderElement(g, e);
		}
	}

	renderAll(g){
		for(let e of this.gElements){
			if(e.flaggedForRender == true){
				this.renderElement(g, e);
				e.flaggedForRender = false;
			}
		}
	}

	setPos(oldX, oldY, newX, newY){
		for(let e of this.gElements){
			e.offset[0] += newX - oldX;
			e.offset[1] += newY - oldY;
		}
	}
}

class Component {

	constructor(x, y, w, h) {

		if(x == undefined) x = 0;
		if(y == undefined) y = 0;
		if(w == undefined) w = 10;
		if(h == undefined) h = 10;

		this.svg = new SVGraphics();

		this.setPos(x, y);
		this.setSize(w, h);

		this.inFocus = true;

	}

	setPos(x, y) {
		this.svg.setPos(this.x, this.y, x, y);
		this.x = x;
		this.y = y;
	}

	setSize(w, h) {
		this.width = w;
		this.height = h;
	}

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

		let size = this.calculateSize(text, tSize);
		this.width = size[0];
		this.height =  size[1];

		this.textShape = new Text(text, this.x + size[0]/2, this.y + size[1]/2, tSize);
		this.textShape.alignH = CENTER;
		this.textShape.alignV = CENTER;
		this.textShape.fillColor = color(255);

		this.bgShape = new Rect(this.x, this.y, this.width, this.height);
		this.bgShape.fillColor = color(0, 0, 0, 0);
		this.bgShape.strokeColor = color(230);
		this.bgShape.strokeWeight = 1;

		this.svg.add(this.bgShape);
		this.svg.add(this.textShape);

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
		let height = (tSize + 3) * lines.length;

		return [width * 1.1, height];
	}

	setText(t) {
		this.textShape.textSize = t;
		this.calculateSize(this.textShape.text, this.textShape.textSize);
	}

	resizeEvent(w, h) {
		this.width = w;
		this.height = h;

		this.bgShape.width = w;
		this.bgShape.height = h;
		this.textShape.height = h;
	}

	setBgColor(color){
		this.bgShape.fillColor = color;
	}

	getShapes(){
		return [this.bgShape, this.textShape];
	}

	setOutlineColor(c){
		this.bgShape.strokeColor = c;
	}

	setOutlineWeight(w){
		this.bgShape.strokeWeight = w;
	}

}

class Button extends Component {

	constructor(text, tSize) {
		textSize(tSize);
		let str = String(text);
		super(0, 0, textWidth(str) * 1.1, textAscent() + textDescent());

		// this.textShape = new Text(text, this.x, this.y , tSize);

		this.baseColor = color(90, 120, 220);

		// this.bgShape = new Rect(this.x, this.y, this.width, this.height);
		// this.bgShape.fillColor = this.baseColor;
		// this.bgShape.strokeWeight = 0;

		// this.svg.add(this.bgShape);
		// this.svg.add(this.textShape);

		this.label = new Label(text, tSize);
		this.label.setBgColor(this.baseColor);
		this.label.setOutlineWeight(0);

		this.svg.addArray(this.label.getShapes());

		this.pressing = false;
		this.hovering = false;

		this.on_press = function() {};
		this.on_hover = function() {};
		this.on_release = function() {};
	}

	reColor() {
		colorMode(HSB);
		let c = this.baseColor;
		if(this.pressing) { // if pressing and hovering are both true this runs
			let b = brightness(c) * 0.9 - 3;
			let s = saturation(c) * 1;
			c = color(hue(c), s, b);
		} else if(this.hovering) {
			// let b = brightness(c) * 1.3 + 5;
			// let s = saturation(c) * 1;
			// c = color(hue(c), s, b);
			// c = color(100, 0, 0);
		}
		colorMode(RGB);

		this.label.setBgColor(c);
	}

	mousePressed(x, y) {
		this.pressing = true;
		this.flagForRender();
		this.on_press();
	}

	mouseReleased(x, y) {
		this.pressing = false;
		this.flagForRender();
	}

	mouseMoved(dx, dy) {
		if(this.hovering == false){
			this.flagForRender();
		}
		this.hovering = true;
	}

	mouseExited(x, y, px, py){
		this.hovering = false;
		this.pressing = false;
		this.flagForRender();
	}

	flagForRender(){
		this.reColor();
		this.label.flagForRender();
	}

}

class Container extends Component {

	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.comps = [];
		this.itemCount = 0;
	}

	addItem(item) {
		this.itemCount++;
		this.comps.push(item);
		for(let s of item.svg.gElements){
			s.translate(item.x, item.y);
			this.svg.add(s);
		}
	}

	resizeEvent(w, h) {
		super.resizeEvent(w, h);
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

	addItem(item) {
		this.itemCount++;
		this.comps.push(item);

		for(let s of item.svg.gElements) {
			s.translate(this.x, this.y);
			s.translate(this.parent.x, this.parent.y);
			this.parent.svg.add(s);
			this.svg.add(s);
		}
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

		//compsGridIndex[a]=index of the grid cell component is in. a = component's index in comps array)
		this.compsGridAtts = [];

		this.margin = 0;
		this.padding = 0;


		this.calculateGridSize();

		this.border = {
			show: true,
			color: color(150),
			thickness: 1.25
		};

		// this.borderShapes = [];
		// for(let i = 0; i < this.columns; i++){
		// 	for(let j = 0; j < this.rows; j++){
		// 		this.borderShapes.push(new Rect(j*));
		// 	}
		// }
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

	renderBorders() {

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
					this.borderRects.push(new Rect(x, y, this.gridWidth, this.gridHeight));
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
				this.borderRects.push(new Rect(x, y, w, h));

			}

		}

	}

}

class Panel extends Component {

	constructor(w, h) {
		super(0, 0, w, h);

		this.layout;
		this.titleBar = {
			show: false,
			minimumHeight: 25,
			height: 50,
			textColor: color(230),
			shape: new Text('', 10, 5, 30)
		};

		this.titleBar.shape.fillColor = this.titleBar.textColor;

		this.bgShape = new Rect(0, 0, this.width, this.height);
		this.bgShape.fillColor = color(200, 200, 200, 10);
		this.bgShape.strokeWeight = 0;

		this.svg.add(this.bgShape);
		this.svg.add(this.titleBar.shape);

		new VListLayout(this);
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

		if(this.titleBar.show == false) {
			this.layout.resizeEvent(w, h);
		} else {
			this.layout.resizeEvent(w, h - this.titleBar.height);
		}

		this.setTitle(this.titleBar.shape.text);
		this.titleBar.shape.x = 10;
		this.titleBar.shape.y = 2;

		this.bgShape.width = w;
		this.bgShape.height = h;
	}

	setPos(x, y){
		if(this.titleBar != undefined){
			//////TODO
		}
		super.setPos(x, y);
	}

	addItem(item) {
		this.layout.addItem(item);
	}

	setTitle(title) {
		this.titleBar.show = true;

		this.titleBar.shape.text = title;

		if(this.height/17 < this.titleBar.minimumHeight) {
			this.titleBar.height = this.titleBar.minimumHeight;
		} else {
			this.titleBar.height = this.height/17;
		}

		this.titleBar.shape.height = this.titleBar.height - 5;


		this.layout.setPos(this.layout.x, this.titleBar.height);
	}

	setBackground(color) {
		this.bgShape.fillColor = color;
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

		this.bgShape.fillColor = color(20, 23, 30);
		this.preMousePressed = false;
		this.shouldRender = true;
	}

	addItem(item){
		super.addItem(item);
		for(let s of item.svg.gElements){
			this.svg.add(s);
		}
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
		this.svg.renderAll(g);
		this.shouldRender = false;
	}
}
