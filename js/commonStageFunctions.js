//————————————————————————————————————————————————————————————
//--------LOADING STAGES--------------------------------------
//————————————————————————————————————————————————————————————

function loadStages(s) {
    game.load.image('bg', 'assets/imgs/background.png');

    game.load.image('frog', 'assets/imgs/frog.png');
    game.load.image('bubble', 'assets/imgs/bubble.png');

    game.load.spritesheet('fly', 'assets/imgs/fly.png', 40, 40);
    game.load.spritesheet('beetle', 'assets/imgs/beetle.png', 65, 65);
    game.load.spritesheet('moth', 'assets/imgs/moth.png', 130, 60);

    game.load.spritesheet('explosion','assets/imgs/explosion.png', 125, 125);
    game.load.audio('sndexplosion', 'assets/snds/hit.wav');
    game.load.audio('sndbubble','assets/snds/bubble.mp3');

    game.load.audio('frogs', 'assets/snds/frogs.wav');

    game.load.text('dictionary', 'assets/json/dictionary.json');
    game.load.text('waves' + s, 'assets/json/stage' + s + '.json');
}

function initiateVariablesStart() {
    game.world.removeAll();

    typedLetters = 0;
    correctLetters = 0;

    deactivatedOWPs = 0;

    wave = 1;

    death = false;

    game.time.reset();
}

function initiateVariables() {

    createdInsects = 0;

    wordsUsed = new Array();
    lettersUsed = new Array();

    owps = new Phaser.ArraySet();
    bubbles = new Phaser.ArraySet();
}

function readWaveInfo(w) {
    console.log('Loading wave', w, 'of stage',stage, '.');

    numberFlies = levelData[w - 1].owpsTypes.flies;
    numberBeetles = levelData[w - 1].owpsTypes.beetles;
    numberMoths = levelData[w - 1].owpsTypes.moths;
    totalInsects = numberFlies + numberBeetles + numberMoths;

    waveSpeed = levelData[w - 1].owpsSpeed;
    waveAppearanceRate = levelData[w - 1].appearanceRate;

    waveLimit = levelData.length;
}

function playMusic() {
    if(music.key == 'bgmusic') {
        music.stop();
        music = game.add.sound('frogs', 0.1, true);
        music.play();
    }
}

//————————————————————————————————————————————————————————————
//--------OWPs------------------------------------------------
//————————————————————————————————————————————————————————————

function createOWP(type) {
    let owp = new Enemy(randomX(type), randomY(type), type);
    owp.sprite = game.add.sprite(owp.x, owp.y, type /*, frame*/);
    owp.configEnemySprite();
    let anima = owp.sprite.animations.add(type);
    anima.play(ANIM_FPS, true, true);
    owps.add(owp);
}

function randomX(type) {
    let min = getSpriteSize(type)[0] / 2 + 5; // 5 pixels for margin
    let max = GAME_AREA_WIDTH - min + 1; // max is exclusive
    return Math.random() * (max - min) + min;
}

function randomY(type) {
    let min = getSpriteSize(type)[1] / 2 - 10;
    let max = getSpriteSize(type)[1] + 15;
    return Math.random() * (max - min) + min;
}

function getSpriteSize(type) {
    switch (type) {
        case 'fly':
            return [SPRITE_FLY_WIDTH, SPRITE_FLY_HEIGHT];
        case 'beetle':
            return [SPRITE_BEETLE_WIDTH, SPRITE_BEETLE_HEIGHT];
        case 'moth':
            return [SPRITE_MOTH_WIDTH, SPRITE_MOTH_HEIGHT];
        default:
            return;
    }
}

function moveWords() {
    for (var i = 0; i < owps.list.length; i++) {
        let owp = owps.list[i];
        owp.text.alignTo(owp.sprite, 11);
    }
}

// OWPS for
/*for (var i = 0; i < owps.list.length; i++) {
    let owp = owps.list[i];
}*/

//————————————————————————————————————————————————————————————
//--------TYPIST----------------------------------------------
//————————————————————————————————————————————————————————————

function checkCollision() {

    for (var i = 0; i < owps.list.length; i++) {
        let owp = owps.list[i];
        game.physics.arcade.overlap(typist.sprite, owp.sprite, collision);
    }

    for (var i = 0; i < bubbles.list.length; i++) {
        let bubble = bubbles.list[i];
        let owp = bubble.target;
        game.physics.arcade.overlap(bubble.sprite, owp.sprite, bubbleCollision);
    }
}

function moveTypist() {
    let x = game.input.mousePointer.x;
    if(x - (SPRITE_FROG_WIDTH / 2) > 15
    && x + (SPRITE_FROG_WIDTH / 2) < GAME_AREA_WIDTH - 15) {
        typist.move(x);
    }
}

function collision() {
    death = true;
    displayExplosion(typist);
    typist.sprite.destroy();
}

//————————————————————————————————————————————————————————————
//--------BUBBLES---------------------------------------------
//————————————————————————————————————————————————————————————

function shootBubble(owp) {
    if(bubbles.list.length == 0 ||
    bubbles.list[bubbles.list.length - 1].letter != owp.word[activeLetter]) {
        let bubble = new Bubble(owp);
        bubble.sprite = game.add.sprite(bubble.x, bubble.y, 'bubble', /*frame*/);
        bubble.configureBubble();
        bubbles.add(bubble);
        playBubbleSound();

    }
}

function bubbleCollision(spr) {
    spr.bubble.hitTarget();
}

//————————————————————————————————————————————————————————————
//--------AUXILIAR FUNCTIONS----------------------------------
//————————————————————————————————————————————————————————————

function getRandomBetween(min, max) { // random between min and max (both included)
    return Math.random() * ((max + 1) - min) + min;
}

function proceedWave() {
    if ((owps.list.length == 0 && createdInsects == totalInsects) || death) {
        wave++;
        game.state.start('HUD');
    }
}

function getTime() {
    seconds = game.time.totalElapsedSeconds();
    let minutes = Math.floor(seconds / 60);
    let secondsToShow = (seconds % 60).toFixed(2);
    return String(minutes).padStart(2, '0') + ':' + String(secondsToShow).padStart(5, '0');
}

function displayExplosion(obj) {
    let explosion = game.add.sprite(obj.sprite.body.x, obj.sprite.body.y, 'explosion');
    explosion.anchor.setTo(0.25, 0.25);

    switch (obj.type) {
        case 'fly':
            explosion.scale.setTo(0.7);
            break;
        case 'beetle':
            explosion.scale.setTo(1);
            break;
        case 'moth':
            explosion.scale.setTo(1.2);
            break;
        case 'typist':
            explosion.scale.setTo(1.5);
            break;
        default:    }

    let anim = explosion.animations.add('exoplode');

    anim.onStart.add(playExplosionSound);
    anim.onComplete.add(proceedWave);

    anim.play(ANIM_FPS, false, true);
}

function playExplosionSound() {
    let sound = game.add.sound('sndexplosion', 0.25);
    sound.play();
}
function playBubbleSound(){
    let sound = game.add.sound('sndbubble',0.05);
    sound.play();
}