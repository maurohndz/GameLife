//======================================
//Document
//======================================
const grid = document.getElementById("grid");
const Living = document.getElementById("Living");
const Generation = document.getElementById("Generation");
//======================================
//Initialize
//======================================
var Data = new Array(); //Array data
var Interval = true; //cycle of control
const fps = 6;
const ctx = grid.getContext("2d"); //create context
const CanvasWidth = 500;
const CanvasHeigth = 450;
const NumberColumns = 50; //numbers columns
const NumberRows = 50; //numbers rows
const Dead = "#ffffff"; //color cellule dead
const Live = "#000000"; //color cellule live
const WidthCellule = CanvasWidth / NumberColumns; //width cellule
const HeigthCellule = CanvasHeigth / NumberRows; //heigth cellule
let CountGeneration = 1; //count generation
//=======================================
// OnLoad
//=======================================
window.addEventListener("load", () => {
  /*=== Camvas size ===*/
  grid.width = CanvasWidth;
  grid.height = CanvasHeigth;
  /*=== Generate Data ===*/
  GenerateData();
  /*=== Clear grid ===*/
  ClearGrid();
  /*=== Draw Grid ===*/
  DrawGrid();
  /*=== Generate Grid Line ===*/
  GenerateGridLine();
});
//=======================================
// Start Cile
//=======================================
const StartCicle = () => {
  Interval = true;
  let count = CountGeneration;
  const run = setInterval(() => {
    if (Interval) {
      Main();
    } else {
      clearInterval(run);
      CountGeneration = count;
    }
    count += 1;
    SetGeneration(count);
  }, 1000 / fps);
};
//=======================================
// Main
//=======================================
const Main = () => {
  let count = 0;
  for (let y = 0; y < NumberRows; y++) {
    for (let x = 0; x < NumberColumns; x++) {
      let cellule = Data[y][x];
      cellule.nextStateCiclo();
    }
  }

  for (let y = 0; y < NumberRows; y++) {
    for (let x = 0; x < NumberColumns; x++) {
      let cellule = Data[y][x];
      cellule.celluleMutation();
      count = count + cellule.nextState;
    }
  }
  /*=== Set count ===*/
  SetCount(count);
  /*=== Clear grid ===*/
  ClearGrid();
  /*=== Draw Grid ===*/
  DrawGrid();
  /*=== Generate Grid Line ===*/
  GenerateGridLine();
};
//=======================================
// Generate Data
//=======================================
const GenerateData = () => {
  Data = [];
  let row = [];
  let cont = 0;
  for (let y = 0; y < NumberRows; y++) {
    for (let x = 0; x < NumberColumns; x++) {
      let celluleState = GenerateNoise();
      row.push(new Cellule(x, y, celluleState));
      cont = cont + celluleState;
    }
    Data.push(row);
    row = [];
  }
  SetCount(cont);
  SetGeneration(1);
};
//=======================================
// Color cellule
//=======================================
const ColorCellule = (cellule) => {
  let { state, y, x } = cellule,
    yStart = y * HeigthCellule,
    xStart = x * WidthCellule;
  /*ctx.fillRect(x, y, width, height);*/
  if (state === 1) {
    ctx.fillStyle = Live;
    ctx.fillRect(xStart, yStart, WidthCellule, HeigthCellule);
  } else {
    ctx.fillStyle = Dead;
    ctx.fillRect(xStart, yStart, WidthCellule, HeigthCellule);
  }
};
//=======================================
// Draw Grid
//=======================================
const DrawGrid = () => {
  for (let y = 0; y < NumberRows; y++) {
    for (let x = 0; x < NumberColumns; x++) {
      ColorCellule(Data[y][x]);
    }
  }
};
//=======================================
// Generar Grid Line
//=======================================
const GenerateGridLine = () => {
  let wid = WidthCellule,
    hei = HeigthCellule;
  for (let i = 1; i < NumberColumns; i++) {
    DrawLine(Live, wid, 0, wid, CanvasHeigth);
    wid += WidthCellule;
  }
  for (let i = 1; i < NumberRows; i++) {
    DrawLine(Live, 0, hei, CanvasWidth, hei);
    hei += HeigthCellule;
  }
};
//=======================================
// Draw line
//=======================================
const DrawLine = (color, xinicial, yinicial, xfinal, yfinal) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(xinicial, yinicial);
  ctx.lineTo(xfinal, yfinal);
  ctx.stroke();
};
//=======================================
// Generate Noise
//=======================================
const GenerateNoise = () => {
  let num = Math.floor(Math.random() * (2 - 0) + 0);
  if (num === 0) {
    return 0;
  } else {
    return 1;
  }
};
//=======================================
// Clear Grid
//=======================================
const ClearGrid = () => {
  ctx.clearRect(0, 0, CanvasWidth, CanvasHeigth);
};
//=======================================
// Generate Automata
//=======================================
const GenerateAutomata = () => {
  Data = [];
  let row = [];
  for (let y = 0; y < NumberRows; y++) {
    for (let x = 0; x < NumberColumns; x++) {
      if (x === 2 && y === 4) {
        row.push(new Cellule(x, y, 1));
      } else if (x === 3 && y === 4) {
        row.push(new Cellule(x, y, 1));
      } else if (x === 4 && y === 4) {
        row.push(new Cellule(x, y, 1));
      } else if (x === 4 && y === 3) {
        row.push(new Cellule(x, y, 1));
      } else if (x === 3 && y === 2) {
        row.push(new Cellule(x, y, 1));
      } else {
        row.push(new Cellule(x, y, 0));
      }
    }
    Data.push(row);
    row = [];
  }
  SetCount(5);
  SetGeneration(1);
};
//=======================================
// Set Count
//=======================================
const SetCount = (number) => {
  Living.innerHTML = number;
};
//=======================================
// Set Count
//=======================================
const SetGeneration = (number) => {
  Generation.innerHTML = number;
};
/*===========================================*/
/* Object Cellule */
/*===========================================*/
class Cellule {
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
      xNeighbor: (this.x - 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y - 1 + NumberColumns) % NumberColumns,
    });
    // [0,-1]
    this.neighbors.push({
      xNeighbor: (this.x + NumberRows) % NumberRows,
      yNeighbor: (this.y - 1 + NumberColumns) % NumberColumns,
    });
    // [1,-1]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y - 1 + NumberColumns) % NumberColumns,
    });
    // [-1,0]
    this.neighbors.push({
      xNeighbor: (this.x - 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y + NumberColumns) % NumberColumns,
    });
    // [1,0]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y + NumberColumns) % NumberColumns,
    });
    // [-1,+1]
    this.neighbors.push({
      xNeighbor: (this.x - 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y + 1 + NumberColumns) % NumberColumns,
    });
    // [0,1]
    this.neighbors.push({
      xNeighbor: (this.x + NumberRows) % NumberRows,
      yNeighbor: (this.y + 1 + NumberColumns) % NumberColumns,
    });
    // [1,1]
    this.neighbors.push({
      xNeighbor: (this.x + 1 + NumberRows) % NumberRows,
      yNeighbor: (this.y + 1 + NumberColumns) % NumberColumns,
    });
  };
  /*=== State Neighbors ===*/
  nextStateCiclo = () => {
    let add = 0;
    for (let i = 0; i < this.neighbors.length; i++) {
      let celluleNeighbor = this.neighbors[i];
      let cell = Data[celluleNeighbor.yNeighbor][celluleNeighbor.xNeighbor];
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

  /*=== Cellule Mutation ===*/
  celluleMutation = () => {
    this.state = this.nextState;
  };
}
