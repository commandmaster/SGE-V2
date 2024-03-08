import { MonoBehaviour } from "./sketch.js";

export default class GameState{
    constructor(p5Var, gameEngine){
      this.p5 = p5Var;
      this.gameEngine = gameEngine;
    }

    Preload(){
        // Load Scripts and Images
        
    }

    Setup(){
        window.addEventListener("resize", () => {
          // To prevent unintended behavior, reload the page on resize
          location.reload();
        });

    }

    Start(){
      // Runs at the start of the game
    }

    Update(){
      // Runs every frame

      
    }

  }

  