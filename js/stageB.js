let stageB = {
    preload: loadStageB,
    create: createStageB,
    update: updateStageB
}

//————————————————————————————————————————————————————————————
//--------LOAD, CREATE AND UPDATE STAGE-----------------------
//————————————————————————————————————————————————————————————

function loadStageB() {
    loadStages('B');
}

function createStageB() {
    // set the background image
    game.add.image(-1, -1, "bg");

    // load the json files
    dictionary = JSON.parse(this.game.cache.getText('dictionary'));
    levelData = JSON.parse(this.game.cache.getText('wavesB'));

    // load info for the wave and play music
    initiateVariables();
    readWaveInfo(wave);
    playMusic();

    // for reading the keyboard and mouse
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.onDownCallback = readKeyboard;
    mouse = game.input.mspointer;
    game.input.mspointer.pointerMoveCallback = moveTypist;

    // create the typist's sprite and configure it
    typist.sprite = game.add.sprite(typist.x, typist.y, 'frog' /*, frame*/);
    typist.configTypistSprite();

    // timers to create the OWPs
    game.time.events.repeat(waveAppearanceRate, numberFlies, createOWP, this, 'fly', true);
    if (numberBeetles > 0)
        game.time.events.repeat(waveAppearanceRate * 2, numberBeetles, createOWP, this, 'beetle', true);
    if (numberMoths > 0)
        game.time.events.repeat(waveAppearanceRate * 3, numberMoths, createOWP, this, 'moth', true);
}

function updateStageB() {

    checkCollision();
    moveWords();
}