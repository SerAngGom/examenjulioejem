let stageC = {
    preload: loadStageC,
    create: createStageC,
    //update: updateStageC
};

function loadStageC() {
    loadStages('C');
}

function createStageC() {
    // set the background image
    game.add.image(-1, -1, "bg");

    /*
    // load the json files
    dictionary = JSON.parse(this.game.cache.getText('dictionary'));
    levelData = JSON.parse(this.game.cache.getText('wavesB'));

    // load info for the wave and play music
    initiateVariables();
    readWaveInfo(wave);
    */
    playMusic();

    /*
    // for reading the keyboard and mouse
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.onDownCallback = readKeyboard;
    mouse = game.input.mspointer;
    game.input.mspointer.pointerMoveCallback = moveTypist;

    // create the typist's sprite and configure it
    typist.sprite = game.add.sprite(typist.x, typist.y, 'frog' /*, frame);
    typist.configTypistSprite();

    // timers to create the OWPs
    game.time.events.repeat(waveAppearanceRate, numberFlies, createOWP, this, 'fly', true);
    if (numberBeetles > 0)
        game.time.events.repeat(waveAppearanceRate * 2, numberBeetles, createOWP, this, 'beetle', true);
    if (numberMoths > 0)
        game.time.events.repeat(waveAppearanceRate * 3, numberMoths, createOWP, this, 'moth', true);
    */

    let infoText;

    infoText = game.add.text(TITLE_OFFSET, TITLE_OFFSET, 'WORK IN PROGRESS', { font: 'Source Sans Pro', fontSize: '60px', fontWeight: 'bold' } );
    infoText.addColor(color, 0);

    infoText = game.add.text(TITLE_OFFSET, 7 * TITLE_OFFSET, 'Please click on the button to go back.', { font: 'Source Sans Pro', fontSize: '20px' } );
    infoText.addColor(color, 0);

    //button for going  back to the start screen
    btnStart = game.add.button(20, 20, 'start', clickBackToStart);
    btnStart.anchor.setTo(0.5);
    btnStart.position.setTo(GAME_AREA_WIDTH / 2, 670);
}

function updateStageC() {

    checkCollision();
    checkOut();
}