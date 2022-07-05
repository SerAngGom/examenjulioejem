let endScreen = {
    preload: loadEndScreen,
    create: createEndScreen
};

function loadEndScreen() {
    game.load.image('bg', 'assets/imgs/background.png');
    game.load.image('start', 'assets/imgs/start.png');
}

function createEndScreen() {

    game.add.image(-1, -1, "bg");

    let infoText;

    if (death) {
        infoText = game.add.text(TITLE_OFFSET, TITLE_OFFSET, 'YOU DIED ON STAGE ' + (stage), { font: 'Source Sans Pro', fontSize: '60px', fontWeight: 'bold', fill: color } );
    } else {
        infoText = game.add.text(TITLE_OFFSET, TITLE_OFFSET, 'STAGE ' + (stage) + ' COMPLETED', { font: 'Source Sans Pro', fontSize: '60px', fontWeight: 'bold', fill: color  } );
    }

    infoText = game.add.text(TITLE_OFFSET, 7 * TITLE_OFFSET, 'ACCURACY: ' + calculateAccuracy() + '%', { font: 'Source Sans Pro', fontSize: '40px', fontWeight: 'bold', fill: color  } );

    infoText = game.add.text(TITLE_OFFSET, 12 * TITLE_OFFSET, 'TYPED LETTERS: ' + typedLetters, { font: 'Source Sans Pro', fontSize: '25px', fill: color  } );

    infoText = game.add.text(TITLE_OFFSET, 15 * TITLE_OFFSET, 'CORRECT LETTERS: ' + correctLetters, { font: 'Source Sans Pro', fontSize: '25px', fill: color  } );

    //button for going  back to the start screen
    btnStart = game.add.button(20, 20, 'start', clickBackToStart);
    btnStart.anchor.setTo(0.5);
    btnStart.position.setTo(GAME_AREA_WIDTH/2, 670);
}

function calculateAccuracy() {
    if (typedLetters==0) return 0;
    return ((correctLetters / typedLetters) * 100).toFixed(2);
}