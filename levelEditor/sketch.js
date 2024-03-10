

let preloadDone = false;
let globalP5;



/**
 * Waits for a condition to be met.
 * @param {Function} condition - The condition to wait for.
 * @returns {Promise} A promise that resolves when the condition is met.
 */
function waitForCondition(condition) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  });
}






class LevelEditor {
  constructor(gamePath){
    this.gamePath = gamePath;
    
    

  }

  start(){
    
  }

  update(){
    
  }

}



window.electronAPI.on("loadEditor", (gamePath) => {
  console.log("Loading Editor")

  let levelEditor;
  let game = function(p){
    globalP5 = p;

    p.preload = async function(){
      levelEditor = new LevelEditor(gamePath);

      setTimeout(() => {
        preloadDone = true;
      }, 1000);
    };

    p.setup = function(){
      levelEditor.start();
    }

    p.draw = function(){
      levelEditor.update();
      

    };
    
  }

    let sketch = new p5(game);

  window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
});