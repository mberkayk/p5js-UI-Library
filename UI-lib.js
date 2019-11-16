class Component {

  constructor(x, y, w, h){

    if(arguments.length == 0){
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    }else if(arguments.length == 2){
      this.x = x;
      this.y = y;
      this.width = 0;
      this.height = 0;
    }else if (arguments.length == 4){
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
    }

  }

  setPos(x, y){
    this.x = x;
    this.y = y;
  }

  setSize(w, h){
    this.width = w;
    this.height = h;
  }

  display(){}

  mousePressed(x, y){}

}

class Label extends Component {

  constructor(text, x, y, w, h){
    super(x, y, w, h);

    this.bg;
    this.textSize;
    this.textColor = color(0);
    this.text = text;
  }

  setText(t){
    this.text = text;
  }

  display(){
    if(this.bgColor != undefined){
      fill(this.bgColor);
      rect(0, 0, this.width, this.height)
    }
    fill(this.textColor);
    if(this.textSize == undefined){
      this.textSize = this.height;
    }
    textSize(this.textSize);
    textAlign(LEFT, TOP);
    text(this.text, this.x, this.y + 1);
    stroke(0);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.width, this.height);
  }

}

class Container extends Component {

  constructor(x, y, w, h){
    super(x, y, w, h);
    this.comps = [];
    this.itemCount = 0;
  }

  display(){
    for(let i = 0; i < this.itemCount; i++){
      this.comps[i].display();
    }
  }

  addItem(item){
    this.itemCount++;
    this.comps = this.comps.concat(item);
  }

}


class Layout extends Container {

  constructor(parent){
    super(parent.x, parent.y, parent.width, parent.height);

    this.parent = parent;
    parent.setLayout(this);

  }

  display(){
    super.display();
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

    this.calculateGridSize();

//  compsGridIndex[a]=index of the grid cell component is in. a = component's index in comps array)
    this.compsGridAtts = [];

    this.margin = 0;
    this.padding = 0;

    this.showBorders = true;
  }

  addItem(c, x, y, w, h) { // Component, GridX, GridY, horizontal span, vertical span

    let index = y * this.columns + x; // index = which grid cell the x,y denotes
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
      let cx = this.x + x * this.gridWidth; //component x (screen x)
      let cy = this.y + y * this.gridHeight; //component y (screen y)
      c.setPos(cx, cy);
      c.resizeEvent(this.gridWidth * w, this.gridHeight * h);
      super.addItem(c);

      if(h == undefined) h = 1;
      if(w == undefined) w = 1;
      this.compsGridAtts.push({cellIndex: index, gridX: x, gridY: y, hSpan: w, vSpan: h});

    }

  } // end of addItem()

  checkIfOccupied(i){
    return this.cells[i];
  }

  resizeEvent(w, h){
    this.setPos(this.parent.x, this.parent.y);
    this.setSize(w, h);
    this.calculateGridSize();

    for(let i = 0; i < this.itemCount; i++){
      this.comps[i].setPos(this.x + this.padding + this.compsGridAtts[i].gridX * this.gridWidth,
                  this.y + this.padding + this.compsGridAtts[i].gridY * this.gridHeight);

      this.comps[i].resizeEvent((this.gridWidth * this.compsGridAtts[i].hSpan) - 2 * this.padding,
           (this.gridHeight * this.compsGridAtts[i].vSpan) - 2 * this.padding);

    }//end of for loop

  }// end of resizeEvent

  calculateGridSize(){
    this.gridWidth = (this.width / this.columns) - this.margin * (this.columns - 1);
    this.gridHeight = (this.height / this.rows) - this.margin * (this.rows - 1);
  }

  setPadding(p){
    this.padding = p;
    this.resizeEvent(this.width, this.height);
  }

  display(){
    super.display();

    if(this.showBorders == true){
      //FOR EMPTY CELLS
      for(let i = 0; i < this.numberOfCells; i++){
        if(this.cells[i] == false){ // if the cell is empty
          strokeWeight(1);
          stroke(0);
          noFill();
          //screen x
          let sx = this.compsGridAtts.x * this.margin + this.compsGridAtts.x * this.gridWidth;
          //screen y
          let sy = this.compsGridAtts.y * this.margin + this.compsGridAtts.y * this.gridHeight;
          rect(sx, sy, this.gridWidth, this.gridHeight);
        }
      }

      //FOR OCCUPIED cells
      for(let i = 0; i < this.itemCount; i++){
        //screen x
        let sx = (this.compsGridAtts.x * this.margin) + this.compsGridAtts.x * this.gridWidth;
        //screen y
        let sy = (this.compsGridAtts.y * this.margin) + this.compsGridAtts.y * this.gridHeight;

        let w = this.margin * (this.compsGridAtts[i].hSpan-1) +
            (this.gridWidth * this.compsGridAtts[i].hSpan);
        let h = this.margin * (this.compsGridAtts[i].vSpan-1) +
            (this.gridHeight * this.compsGridAtts[i].vSpan);

        stroke(0);
        strokeWeight(1);
        noFill();
        rect(sx, sy, w, h);
      }
    }

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


class Panel extends Container {

  constructor(x, y, w, h){
    super(x, y, w, h);

    this.layout;
    this.titleBar = {minimumHeight:30};
  }

  display(){
    super.display();

    if(this.titleBar.title != undefined){
      fill(0);
      textSize(this.width / 30);
      text(this.titleBar.title, this.x + this.width/3, this.y + this.titleBar.height/3);
    }
    if(this.layout != undefined){
      this.layout.display();
    }
  }

  setLayout(layout){
    this.layout = layout;
  }

  resizeEvent(w, h){
    this.setSize(w, h);
    if(this.layout != undefined){

      if(this.titleBar.height == undefined){
        this.layout.resizeEvent(w,h);
      }else{
        this.layout.resizeEvent(w, h-this.titleBar.height);
      }

    }

  }

  setTitle(title){
     this.titleBar.title = title;
     if(this.height < this.titleBar.minimumHeight * 3.5){
       this.titleBar.height = this.titleBar.minimumHeight;
     }else{
       this.titleBar.height = 20;
     }
   }

  mousePressed(x, y){
     if(this.layout != undefined){
       this.layout.mousePressed(x, y);
     }
   }

}
