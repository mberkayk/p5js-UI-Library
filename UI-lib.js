class Component {

  constructor(x, y, w, h){

    if(x == undefined) x = 0;
    if(y == undefined) y = 0;
    if(w == undefined) w = 10;
    if(h == undefined) h = 10;

    this.setPos(x, y);
    this.setSize(w, h);

  }

  setPos(x, y){
    this.x = x;
    this.y = y;
  }

  setSize(w, h){
    this.width = w;
    this.height = h;
  }

  render(g){}

  resizeEvent(w, h){
    this.setSize(w, h);
  }

  mousePressed(x, y){}

}

class Label extends Component {

  constructor(text, x, y, w, h){
    super(x, y, w, h);

    this.bgColor;
    this.textSize;
    this.textColor = color(0);
    this.text = text;
  }

  setText(t){
    this.text = t;
  }

  render(g){
    //Background
    if(this.bgColor != undefined){
      g.fill(this.bgColor);
      g.rect(this.x, this.y, this.width, this.height)
    }
    //Text
    g.fill(this.textColor);
    if(this.textSize == undefined){
      this.textSize = this.height;
    }
    g.textSize(this.textSize);
    g.textAlign(LEFT, TOP);
    g.text(this.text, this.x + 2, this.y + 2);
    //Borders
    g.stroke(0);
    g.strokeWeight(1);
    g.noFill();
    g.rect(this.x, this.y, this.width, this.height);

  }

  setBackground(color){
    this.bgColor = color;
  }
}

class Container extends Component {

  constructor(x, y, w, h){
    super(x, y, w, h);
    this.comps = [];
    this.itemCount = 0;
  }

  render(g) {
    for(const comp of this.comps){
      comp.render(g);
    }
  }

  addItem(item){
    this.itemCount++;
    this.comps.push(item);
  }

  resizeEvent(w, h){
    super.resizeEvent(w,h);
    this.g = createGraphics(w, h);
  }

}

class Layout extends Container {

  constructor(parent){
    super(parent.x, parent.y, parent.width, parent.height);

    this.parent = parent;
    parent.setLayout(this);

  }

  render(g){
    super.render(g);
  }

  resizeEvent(w, h){
    super.resizeEvent(w, h);
  }

}

class VListLayout extends Layout {

  constructor(parent){
    super(parent);

    this.spacing = 20;
    this.nextItemY = this.spacing;
  }

  addItem(item){
    super.addItem(item);
    this.calculatePosition();
  }

  calculatePosition(){
    this.nextItemY = this.spacing;
    for(const c of this.comps){
      c.setPos(this.width/2 - c.width/2, this.nextItemY);
      this.nextItemY += c.height + this.spacing;
    }

  }

  render(g){
    super.render(g);
  }

  resizeEvent(w, h){
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
    for (let i = 0; i < this.numberOfCells; i++) {
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

    if (arguments.length == 3) {

      if (this.checkIfOccupied(index) == false) { // if empty

        this.cells[index] = true; //occupied
        available = true;

      } else { // if the cell is occupied
        console.log('Grid cell is already occupied!');
      }

    }else if (arguments.length == 5) {

      let stack = [];

      loop:
      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          let cellX = x + j;
          let cellY = y + i;
          let index = cellX + cellY * this.columns;

          if(this.checkIfOccupied(index) == false){ // if not occupied
            stack.push(index);
          }else{
            break loop;
          }
        }
      }

      let area = w*h; // Area of the component in the grid
      if(stack.length == area){ // if all the required cells are empty
        for(let i = 0; i < area; i++){
          this.cells[stack.pop()] = true; //occupy the cells
        }
        available = true;
      }

    } // end of (else if length == 5)

    if(available){

      if(h == undefined) h = 1;
      if(w == undefined) w = 1;

      let cx = this.margin + (this.margin * 2 * x) + x * this.gridWidth; // component x
      let cy = this.margin + (this.margin * 2 * y) + y * this.gridHeight; //component y
      c.setPos(cx + this.padding, cy * this.padding);
      c.resizeEvent((this.margin * 2 * w) + (this.gridWidth * w) - this.padding*2,
                    (this.margin * 2 * h) + this.gridHeight * h) - this.padding*2;
      super.addItem(c);

      this.compsGridAtts.push({cellIndex: index, gridX: x, gridY: y, hSpan: w, vSpan: h});

    }

  } // end of addItem()

  checkIfOccupied(i){
    return this.cells[i];
  }

  resizeEvent(w, h){
    this.setSize(w, h);
    this.calculateGridSize();

    for(let i = 0; i < this.itemCount; i++){
      let xMarginOffset = this.margin + (this.margin*2*this.compsGridAtts[i].gridX);
      let yMarginOffset = this.margin + (this.margin*2*this.compsGridAtts[i].gridY);

      let xGridOffset = this.compsGridAtts[i].gridX * this.gridWidth;
      let yGridOffset = this.compsGridAtts[i].gridY * this.gridHeight;

      this.comps[i].setPos(this.padding + xMarginOffset + xGridOffset,
                  this.padding + yMarginOffset + yGridOffset);


      // WARNING: This won't work for components with hspan or vspan higher than 1
      // because it does NOT account for margin
      this.comps[i].resizeEvent((this.gridWidth * this.compsGridAtts[i].hSpan) - 2 * this.padding,
           (this.gridHeight * this.compsGridAtts[i].vSpan) - 2 * this.padding);

    }//end of for loop

  }// end of resizeEvent()

  calculateGridSize(){
    this.gridWidth = (this.width / this.columns) -  this.columns * this.margin * 2;
    this.gridHeight = (this.height / this.rows) - this.rows * this.margin * 2;
  }

  setMargin(m){
    this.margin = m;
    this.calculateGridSize();
  }

  setPadding(p){
    this.padding = p;
    this.resizeEvent(this.width, this.height);
  }

  render(g){

    //display borders
    if(this.showBorders == true){
      //FOR EMPTY CELLS
      for(let i = 0; i < this.numberOfCells; i++){
        if(this.cells[i] == false){ // if the cell is empty
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
      for(let i = 0; i < this.itemCount; i++){

        //x and y values in this.g graphics object
        let x = this.margin + (this.margin * this.compsGridAtts[i].gridX * 2) +
              (this.compsGridAtts[i].gridX * this.gridWidth);
        let y = this.margin + (this.margin * this.compsGridAtts[i].gridY * 2) +
                (this.compsGridAtts[i].gridY * this.gridHeight);

        // width and the height of the border rectamgle
        let w =  (this.padding * 2 * this.compsGridAtts[i].hSpan) +
         (this.compsGridAtts[i].hSpan * this.gridWidth);
        let h = (this.padding * 2 * this.compsGridAtts[i].vSpan) +
         (this.compsGridAtts[i].vSpan * this.gridHeight);

        g.stroke(0);
        g.strokeWeight(1);
        g.noFill();
        g.rect(x, y, w, h);

      }

    }

    super.render(g);

  }

  mousePressed(x, y){
    for(let i = 0; i < this.itemCount; i++){

      if(x >= this.comps[i].x && x < this.comps[i].x + this.comps[i].width){
        if(y >= this.comps[i].y && y < this.comps[i].y + this.comps[i].height){
          this.comps[i].mousePressed(x, y);
        }
      }

    }
  }

}

class Panel extends Component {

  constructor(x, y, w, h){
    super(x, y, w, h);

    this.layout;
    this.bgColor;
    this.titleBar = {minimumHeight:30, height:50};

    this.g = createGraphics(this.width, this.height);

    new VListLayout(this);
  }

  render(g){

    if(this.bgColor != undefined){
      //this.g.background(this.bgColor);
      this.g.noStroke();
      this.g.fill(this.bgColor);
      this.g.rect(0, 0, this.width, this.height);
    }

    if(this.titleBar.title != undefined){
      this.g.fill(125);
      this.g.rect(0, 0, this.width, this.titleBar.height);

      this.g.fill(0);
      this.g.textSize(this.width / 30);
      this.g.textAlign(CENTER, TOP);
      this.g.text(this.titleBar.title, this.width/2, this.titleBar.height/5);

      this.g.push();
      this.g.translate(this.layout.x, this.layout.y);
      this.layout.render(this.g);
      this.g.pop();
    }else {
      this.layout.render(this.g);
    }

    g.image(this.g, this.x, this.y);

  }

  setLayout(layout){
    this.layout = layout;
  }

  resizeEvent(w, h){
    super.resizeEvent(w, h);

    this.g = createGraphics(w, h);

    if(this.titleBar.height == undefined){
      this.layout.resizeEvent(w,h);
    }else{
      this.layout.resizeEvent(w, h-this.titleBar.height);
    }

  }

  addItem(item){
    this.layout.addItem(item);
  }

  setTitle(title){
     this.titleBar.title = title;
     if(this.height < this.titleBar.minimumHeight * 9){
       this.titleBar.height = this.titleBar.minimumHeight;
     }else{
       this.titleBar.height = 20;
     }
     this.layout.setPos(this.layout.x, this.titleBar.height);
   }

  setBackground(color){
     this.bgColor = color;
   }

  mousePressed(x, y){
     if(this.layout != undefined){
       this.layout.mousePressed(x, y);
     }
   }

}
