let stageA = {
    preload: loadStageA,
    create: createStageA,
    update: updateStageA
}

//————————————————————————————————————————————————————————————
//--------LOAD, CREATE AND UPDATE STAGE-----------------------
//————————————————————————————————————————————————————————————

function loadStageA() {
    loadStages('A');
}

function createStageA() {
    // set the background image
    game.add.image(-1, -1, "bg");

    // load the json files
    dictionary = JSON.parse(this.game.cache.getText('dictionary'));
    levelData = JSON.parse(this.game.cache.getText('wavesA'));

    // load info for the wave and play music
    initiateVariables();
    readWaveInfo(wave);
    playMusic();

    // for reading the keyboard
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.onDownCallback = readKeyboard;

    // create the typist's sprite and configure it
    typist.sprite = game.add.sprite(typist.x, typist.y, 'frog' /*, frame*/);
    typist.configTypistSprite();

    // timer to create the OWPs
    game.time.events.repeat(waveAppearanceRate, numberFlies, createOWP, this, 'fly', 'timer');
}

function updateStageA() {

    checkCollision();
    moveWords();
}