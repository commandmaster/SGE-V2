// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let levelEditorSketch = function(p5){
  globalP5 = p5;

  p5.preload = function(){
    
  }

  p5.setup = function(){
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    
  }

  p5.draw = function(){
    p5.background(205);
  }

  p5.windowResized = function(){
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

}


let levelEditor = new p5(levelEditorSketch);