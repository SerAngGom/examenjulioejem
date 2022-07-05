//————————————————————————————————————————————————————————————
//--------TYPIST----------------------------------------------
//————————————————————————————————————————————————————————————

class Typist {
    constructor() {
        this.x = GAME_AREA_WIDTH / 2;
        this.y = GAME_AREA_HEIGHT - SPRITE_FROG_HEIGHT / 2 - 30; // 15 pixels of margin
        this.type = 'typist';
        this.sprite;
    }

    configTypistSprite() {
        this.sprite.anchor.setTo(0.5);

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }

    refocusTypist(owp) {
        let typistToOWPX = owp.sprite.x - this.sprite.x;
        let typistToOWPY = this.sprite.y - owp.sprite.y;
        this.sprite.angle = Math.atan2(typistToOWPX, typistToOWPY) * RADIANS_TO_DEGREES;
    }

    resetTypist() {
        this.sprite.angle = 0;
    }

    move(x) {
        this.sprite.x = x;
        this.x = this.sprite.x;

        for (var i = 0; i < owps.list.length; i++) {
            let owp = owps.list[i];
            owp.refocusOWP();
        }
    }
}


//————————————————————————————————————————————————————————————
//--------ENEMIES---------------------------------------------
//————————————————————————————————————————————————————————————

class Enemy {
    constructor(x, y, type, created = false) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.sprite;

        this.deactivated = false;

        this.speed = this.getSpeed();
        this.word = this.getWord();

        this.timer = null;

        if (type == 'beetle') {
            this.timer = game.time.events.loop(REPLICATION_RATE, this.replicate, this);
        }
        else if (type == 'moth') {
            this.timer = game.time.events.loop(FAN_GENERATION_RATE, this.fanGenerate, this);
        }

        this.created = created;
    }

    configEnemySprite() {
        this.sprite.anchor.setTo(0.5,0.5);

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);

        this.text = game.add.text(this.x, this.y + WORD_OFFSET, this.word, { font: 'Source Sans Pro', fontSize: '20px' } );

        this.refocusOWP();
    }

    getSpeed() {
        return waveSpeed;
    }

    getWord() {
        let word;
        let foundWord = false;
        // switch to diferentiate between types
        switch(this.type) {

            case '':
                while(!foundWord) {
                    word = '' +  CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)).toString();
                    if (word && !wordsUsed.includes(word) && !lettersUsed.includes(word[0])) {
                        foundWord = true;
                        wordsUsed.push(word);
                        lettersUsed.push(word[0]); }
                } break;

            case 'fly':     // 2 to 7 letters
                while(!foundWord) {
                    let index = this.randomNumber(0, ARRAY_FLY + 1);
                    word = dictionary.words.fly[index];
                    if (word && !wordsUsed.includes(word) && !lettersUsed.includes(word[0])) {
                        foundWord = true;
                        wordsUsed.push(word);
                        lettersUsed.push(word[0]); }
                } break;

            case 'beetle':  // 8 to 10 letters
                while(!foundWord) {
                    let index = this.randomNumber(0, ARRAY_BEETLE + 1);
                    word = dictionary.words.beetle[index];
                    if (word && !wordsUsed.includes(word) && !lettersUsed.includes(word[0])) {
                        foundWord = true;
                        wordsUsed.push(word);
                        lettersUsed.push(word[0]); }
                } break;

            case 'moth':    // more than 10 letters
                while(!foundWord) {
                    let index = this.randomNumber(0, ARRAY_MOTH + 1);
                    word = dictionary.words.moth[index];
                    if (word && !wordsUsed.includes(word) && !lettersUsed.includes(word[0])) {
                        foundWord = true;
                        wordsUsed.push(word);
                        lettersUsed.push(word[0]); }
                } break;

            default:
                console.log('NO WORD');
        }
        return word;
    }

    refocusOWP() {
        if(this.sprite) {
            let enemyVX = typist.x - this.x;
            let enemyVY = typist.y - this.y;
            let enemyAngle = Math.atan2(enemyVY, enemyVX) * RADIANS_TO_DEGREES;
            enemyAngle += this.getAngleDeviation();
            this.sprite.angle = enemyAngle + ENEMY_SPRITE_LEFT_ANGLE;
            enemyVX = this.speed * Math.cos(enemyAngle * 1 / RADIANS_TO_DEGREES);
            enemyVY = this.speed * Math.sin(enemyAngle * 1 / RADIANS_TO_DEGREES);
            this.sprite.body.velocity.setTo(enemyVX, enemyVY);
        }
    }

    getAngleDeviation() {
        let angleDeviationSign = 1;
        if (Math.random() < 0.5)
            angleDeviationSign = -1;
        let angleDeviationValue = Math.random() * MAX_ANGLE_DEVIATION;
        return angleDeviationValue * angleDeviationSign;
    }

    randomNumber(min, max) {
        max += 1;
        return Math.floor(Math.random() * (max - min) + min);
    }

    deleteOWP() {
        if(this.waitTimer) { game.time.events.remove(this.waitTimer); }
        if (this.timer) { game.time.events.remove(this.timer); }

        owps.remove(this);
        displayExplosion(this);

        if(!this.created) { createdInsects++; }
        deactivatedOWPs++;

        this.sprite.destroy();
    }

    deleteText() {
        if(this.waitTimer) { game.time.events.remove(this.waitTimer); }
        if (this.timer) { game.time.events.remove(this.timer); }

        let i = wordsUsed.indexOf(this.word);
        wordsUsed.splice(i, 1);
        i = lettersUsed.indexOf(this.word[0]);
        lettersUsed.splice(i, 1);

        typist.resetTypist();
        this.text.destroy();
        this.deactivated = true;
    }

    deactivateLetter(l) {
        this.text.clearColors();
        this.text.addColor('#F5F0E4', 0);
        this.text.addColor('#ABA8A2', l + 1);
    }

    stopOWP() {
        this.sprite.body.stop();
        this.waitTimer = game.time.events.add(150, this.moveOWP, this);
    }

    moveOWP() {
        if(this.waitTimer) { game.time.events.remove(this.waitTimer); }
        this.refocusOWP();
    }

// special OWP methods —————————————————————————————————————

    replicate() {
        console.log('Replicating an OWP.');
        let offset = SPRITE_BEETLE_HEIGHT / 2 + 10;
        let x = this.sprite.x + (WORD_OFFSET * 5 * this.randomNumber(-1, 1));
        let y = this.sprite.y + offset + 10;

        let owp = new Enemy(x, y, 'fly', true);
        owp.sprite = game.add.sprite(owp.x, owp.y, 'fly' /*, frame*/);
        let anima = owp.sprite.animations.add('fly');
        anima.play(ANIM_FPS, true, true);
        owp.configEnemySprite();
        owps.add(owp);
    }

    fanGenerate() {
        let n = this.randomNumber(6, 10);
        console.log('Fan-generating', n, 'letters.');
        let offset = SPRITE_MOTH_HEIGHT / 2 + 10;

        for (var i = 0; i < n; i++) {

            let x = this.sprite.x;
            if (i % 2 == 0) {
                x = x - (20 * i);
            } else {
                x = x + (20 * i);
            } let y = this.sprite.y + offset + (4 * (n - i));

            let owp = new Enemy(x, y, '', true);
            owp.sprite = game.add.sprite(owp.x, owp.y, 'fly' /*, frame*/);
            let anima = owp.sprite.animations.add('fly');
            anima.play(ANIM_FPS, true, true);
            owp.configEnemySprite();
            owps.add(owp);
        }
    }


}

//————————————————————————————————————————————————————————————
//--------BUBBLES---------------------------------------------
//————————————————————————————————————————————————————————————

class Bubble {
    constructor(t) {
        this.x = typist.x;
        this.y = typist.y - (SPRITE_FROG_HEIGHT / 2);

        this.speed = t.speed * 100;

        this.targetX = t.sprite.x;
        this.targetY = t.sprite.y;

        this.target = t;
        this.letter = t.word[activeLetter - 1];
    }

    configureBubble() {
        this.sprite.anchor.setTo(0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.bubble = this;

        game.physics.arcade.moveToObject(this.sprite, this.target.sprite, this.speed);
    }

    hitTarget() {
        this.target.stopOWP();

        this.sprite.destroy();
        bubbles.remove(this);

        if (this.target.deactivated) {
            this.target.deleteOWP();
        }
    }
}