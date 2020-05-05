//====================================
//document
//====================================
const Generate_Pattern = document.getElementById("Generate_Pattern");
const Automaton = document.getElementById("Automaton");
const Start = document.getElementById("Start");
const Stop = document.getElementById("Stop");
//====================================
//Generate pattern
//====================================
Generate_Pattern.addEventListener("click", () => {
  Interval = false;
  /*=== Generate Data ===*/
  GenerateData();
  /*=== Clear grid ===*/
  ClearGrid();
  /*=== Draw Grid ===*/
  DrawGrid();
  /*=== Generate Grid Line ===*/
  GenerateGridLine();
});
//====================================
//Generate pattern
//====================================
Automaton.addEventListener("click", () => {
  /*=== Generate Data ===*/
  GenerateAutomata();
  /*=== Clear grid ===*/
  ClearGrid();
  /*=== Draw Grid ===*/
  DrawGrid();
  /*=== Generate Grid Line ===*/
  GenerateGridLine();
});
//====================================
//Start
//====================================
Start.addEventListener("click", () => {
  /*=== Generate Data ===*/
  StartCicle();
});
//====================================
//Stop
//====================================
Stop.addEventListener("click", () => {
  Interval = false;
});
