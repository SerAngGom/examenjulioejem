// the game is created in constantDefinitions.js

function startGame() {
    game.state.add('startScreen', startScreen);
    game.state.add('aboutScreen', aboutScreen);
    game.state.add('stageA', stageA);
    game.state.add('stageB', stageB);
    game.state.add('stageC', stageC);
    game.state.add('HUD', HUD);
    game.state.add('endScreen', endScreen);

    game.state.start('startScreen');
}

// entry point ———————————————————————————————————————————————
window.onload = startGame;


//————————————————————————————————————————————————————————————
//--------GLOBAL VARIABLE DEFFINITIONS------------------------
//————————————————————————————————————————————————————————————

// main/common global variables ——————————————————————————————
let typist = new Typist();  // the typist for our game
let owps;                   // the array that contains all enemies on screen
let bubbles;                // the array that contains the bubbles (bullets) on screen

let deactivatedOWPs;         // the total number of deactivated owps in a stage

var dictionary;
var levelData;

let wordsUsed;      // array with the words on screen
let lettersUsed;    // array with the frist letter of wordsUsed

let stage;          // letter to know which stage the game is in

let wave;           // the current wave (from ) to waveLimit)
let waveLimit;      // number of waves in the stage

let numberFlies;    // total flies in the wave
let numberBeetles;  // total beetles in the wave
let numberMoths;    // total moths in the wave
let totalInsects;
let createdInsects;

let waveSpeed;      // the speed at which owps move in the wave
let waveAppeareanceRate; //  the appeareance rate of owps in the wave

let gameTimer;       // the timer that counts the elapsed time during the game
let seconds;

let music;

// about screen ——————————————————————————————————————————————
let btnCredits;
let btnStart;

// Start screen ——————————————————————————————————————————————
let titleStartScreen;
let titleStartScreenBlurring;
let btnStageA;
let btnStageABlurring;
let btnStageB;
let btnStageBBlurring;
let btnStageC;
let btnStageCBlurring;
let btnAbout;
let btnAboutBlurring;

// HUD screen ————————————————————————————————————————————————
let death;              // to know if the HUD was reached through death or not
let color = 'white';    // color for the titles in the HUD screen, to avoid typing the same sentence too many times

// input functions ————————————————————————————————————————
let cursors;            // to have control of what is typed
let mouse;

let activeOWP = null;   // the currently active owp (the one that must be typed to delete)
let activeLetter = 0;   // index of the active letter in the active OWP (from 0)

let typedLetters;       // total number of letters typed in the stage
let correctLetters;     // total number of correctly typed letters in the stage