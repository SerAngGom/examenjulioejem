function readKeyboard(e) {
    if(e.keyCode >= Phaser.Keyboard.A
    && e.keyCode <= Phaser.Keyboard.Z) {
        typedLetters++;
        checkLetter(e.key);
    } return activeOWP;
}

function checkLetter(a) {
    if (activeOWP) {
        nextLetterInOWP(a, activeOWP);
    }

    else {
        for (var i = 0; i < owps.list.length; i++) {
            let owp = owps.list[i];
            activeOWP = nextLetterInOWP(a, owp);
            if (activeOWP) {
                break;
            }
        }
    } return activeOWP;
}

function nextLetterInOWP(a, owp) {
    if (a == owp.word[activeLetter]) {
        typist.refocusTypist(owp);
        activeOWP = owp;
        correctLetters++;
        advanceLetter(owp);
        return activeOWP;
    }
}

function advanceLetter(owp) {
    owp.deactivateLetter(activeLetter);
    if (activeLetter < owp.word.length - 1) {
        activeLetter++;
    } else {
        activeOWP.deleteText();
        activeOWP = null;
        activeLetter = 0;
    }
    shootBubble(owp);
    return activeOWP;
}