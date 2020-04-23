/*===========================================*/
/* Document */
/*===========================================*/
const grid = document.getElementById("grid");
const btn_Start = document.getElementById("btn_Start");

/*===========================================*/
/* settings */
/*===========================================*/
const Data = new Array();
const ctx = grid.getContext("2d");
const { clientHeight, clientWidth } = ctx.canvas;
const fps = 6;
const colNumber = 50;
const rowNumber = 50;
const CanvasWidth = clientWidth;
const CanvasHeigth = clientHeight;
const White = "#fffff";
const Black = "#00000";
const size = CanvasWidth / colNumber;
const nColumn = CanvasWidth / size;
const nRow = CanvasHeigth / size;

/*===========================================*/
/* Object Cell */
/*===========================================*/
class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state; //live = 1, dead= 0
    this.nextstate = this.state;
    this.neighbors = [];

    this.addNeighbors();
  }

  /*=== Add Neighbors ===*/
  addNeighbors = () => {
    // [-1,-1]
    this.neighbors.push({
      xNeighbor: (this.x - 1 + nRow) % nRow,
      yNeighbor: (this.y - 1 + nColumn) % nColumn,
    });
    // [0,-1]
    this.neighbors.push({
      xNeighbor: (this.x + nRow) % nRow,
      yNeighbor: (this.y - 1 + nColumn) % nColumn,
    });
    // [1,-1]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + nRow) % nRow,
      yNeighbor: (this.y - 1 + nColumn) % nColumn,
    });
    // [-1,0]
    this.neighbors.push({
      xNeighbor: (this.x - 1 + nRow) % nRow,
      yNeighbor: (this.y + nColumn) % nColumn,
    });
    // [1,0]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + nRow) % nRow,
      yNeighbor: (this.y + nColumn) % nColumn,
    });
    // [-1,+1]
    this.neighbors.push({
      xNeighbor: (this.x - 1 + nRow) % nRow,
      yNeighbor: (this.y + 1 + nColumn) % nColumn,
    });
    // [0,1]
    this.neighbors.push({
      xNeighbor: (this.x + nRow) % nRow,
      yNeighbor: (this.y + 1 + nColumn) % nColumn,
    });
    // [1,1]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + nRow) % nRow,
      yNeighbor: (this.y + 1 + nColumn) % nColumn,
    });
  };
  /*=== State Neighbors ===*/
  nextStateCiclo = () => {
    let add = 0;
    for (let i = 0; i < this.neighbors.length; i++) {
      let cellNeighbor = this.neighbors[i];
      let cell = Data[cellNeighbor.yNeighbor][cellNeighbor.xNeighbor];
      add += cell.state;
    }
    /*=== Conway rules ===*/
    /*
        A dead cell with exactly 3 living neighboring cells is "born" (ie it will be alive the next turn).
        A living cell with 2 or 3 living neighboring cells is still alive, otherwise it dies (due to "loneliness" or "overpopulation").
    */
    // state default
    this.nextState = this.state;
    //dead
    if (add < 2 || add > 3) {
      this.nextState = 0;
    }
    //living
    if (add == 3) {
      this.nextState = 1;
    }
  };

  /*=== Cell Mutation ===*/
  cellMutation = () => {
    this.state = this.nextState;
  };
}

/*===========================================*/
/* OnLoad */
/*===========================================*/
window.addEventListener("load", () => {
  /*=== Camvas size ===*/
  grid.width = CanvasWidth;
  grid.height = CanvasHeigth;
  /*=== Generate Data ===*/
  GenerateData();
  /*=== Clear canvas, Draw Grid and draw line grid ===*/
  ClearGrid();
});

/*===========================================*/
/* Start */
/*===========================================*/
btn_Start.addEventListener("click", () => {
  setInterval(() => {
    Main();
  }, 1000 / fps);
  // Main();
});

/*===========================================*/
/* Main funtion */
/*===========================================*/
const Main = () => {
  for (let y = 0; y < nRow; y++) {
    for (let x = 0; x < nColumn; x++) {
      let cell = Data[y][x];
      cell.nextStateCiclo();
    }
  }

  for (let y = 0; y < nRow; y++) {
    for (let x = 0; x < nColumn; x++) {
      let cell = Data[y][x];
      cell.cellMutation();
    }
  }

  ClearGrid();
};

/*===========================================*/
/* Generate Noise */
/*===========================================*/
const GenerateNoise = () => {
  let num = Math.floor(Math.random() * (2 - 0) + 0);
  if (num === 0) {
    return 0;
  } else {
    return 1;
  }
};

/*===========================================*/
/* Generar Data */
/*===========================================*/
const GenerateData = () => {
  let row = [];
  for (let y = 0; y < nRow; y++) {
    for (let x = 0; x < nColumn; x++) {
      row.push(new Cell(x, y, GenerateNoise()));
    }
    Data.push(row);
    row = [];
  }
};

/*===========================================*/
/* Generar Grid Line*/
/*===========================================*/
const GenerateGridLine = () => {
  let wid = size,
    hei = size;
  for (let i = 1; i < nColumn; i++) {
    DrawLine("black", wid, 0, wid, CanvasHeigth);
    DrawLine("black", 0, hei, CanvasWidth, hei);
    wid = wid + size;
    hei = hei + size;
  }
};

/*===========================================*/
/* Color Cell */

/*===========================================*/
const ColorCell = (cell) => {
  let { state, y, x } = cell,
    yStart = y * size,
    xStart = x * size;
  /*ctx.fillRect(x, y, width, height);*/
  if (state === 1) {
    ctx.fillStyle = "black";
    ctx.fillRect(xStart, yStart, size, size);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(xStart, yStart, size, size);
  }
};

/*===========================================*/
/* Draw Grid */
/*===========================================*/
const DrawGrid = () => {
  for (let y = 0; y < nRow; y++) {
    for (let x = 0; x < nColumn; x++) {
      ColorCell(Data[y][x]);
    }
  }
};

/*===========================================*/
/* Clear Grid //*/
/*===========================================*/
const ClearGrid = () => {
  ctx.clearRect(0, 0, CanvasWidth, CanvasHeigth);
  DrawGrid();
  GenerateGridLine();
};

/*===========================================*/
/* Draw line //*/
/*===========================================*/
const DrawLine = (color, xinicial, yinicial, xfinal, yfinal) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(xinicial, yinicial);
  ctx.lineTo(xfinal, yfinal);
  ctx.stroke();
};
