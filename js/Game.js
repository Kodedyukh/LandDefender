
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

    create: function () {

        //this.background = this.add.sprite(0, 0, 'gameBackground');
        this.backgroundMusic = this.add.audio('backgroundMusic');
        this.game.sound.setDecodedCallback([this.backgroundMusic], function(){
            this.backgroundMusic.volume = 0.4;
            this.backgroundMusic.loopFull()
        }, this);

        //this.customTimer = new Phaser.Timer(this.game);
        //this.customTimer.start();


        this.recruitmentTip = this.add.sprite(0, 400, 'recruitmentTip');

        this.field = new Field(this.game, 9, 5);  

        this.field.zombieInTownSignal.add(this.looseGame, this);

        /*for (var j=0; j<5; j++) {
            this.field.map[j][8].createUnit('walker');  
        }*/
        //this.field.map[2][8].createUnit('walker');

        /*this.game.time.events.add(3000, function(){
            console.log('second walker production');
            this.field.map[2][8].createUnit('walker');
        }, this);
        this.game.time.events.add(7000, function(){
            console.log('second walker production');
            this.field.map[2][8].createUnit('walker');
        }, this);*/
        //this.field.map[2][0].createUnit('militia');  

        this.currentBarracks = null;

        
        this.input.onDown.add(this.setCurrentBarracks, this);

        // recriut panel

        this.recruitPanel = this.add.group();

        this.recruitPanel.create(0, 400, 'buttonUnderlay');

        this.recruitMilitiaButton = this.add.button(60, 440, 'militiaBut', this.recruitUnit, this, 'out', 'out', 'down', 'out');
        this.recruitMilitiaButton.anchor.setTo(0.5, 0.5);
        this.recruitMilitiaButton.unitName = 'militia';

        this.recruitArcherButton = this.add.button(180, 440, 'archerBut', this.recruitUnit, this, 'out', 'out', 'down', 'out');
        this.recruitArcherButton.anchor.setTo(0.5, 0.5);
        this.recruitArcherButton.unitName = 'archer';

        this.recruitPikemanButton = this.add.button(300, 440, 'pikemanBut', this.recruitUnit, this, 'out', 'out', 'down', 'out');
        this.recruitPikemanButton.anchor.setTo(0.5, 0.5);
        this.recruitPikemanButton.unitName = 'pikeman';

        this.recruitKnightButton = this.add.button(420, 440, 'knightBut', this.recruitUnit, this, 'out', 'out', 'down', 'out');
        this.recruitKnightButton.anchor.setTo(0.5, 0.5);
        this.recruitKnightButton.unitName = 'knight';

        this.recruitPanel.add(this.recruitMilitiaButton);
        this.recruitPanel.add(this.recruitArcherButton);
        this.recruitPanel.add(this.recruitPikemanButton);
        this.recruitPanel.add(this.recruitKnightButton);
        this.recruitMilitiaButton.inputEnabled = false;
        this.recruitArcherButton.inputEnabled = false;
        this.recruitPikemanButton.inputEnabled = false;
        this.recruitKnightButton.inputEnabled = false;

        this.recruitPanel.alpha = 0;

        // assign keys
        this.oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.oneKey.onDown.add(function(){
            var pseudoButton = {unitName: 'militia'};
            this.recruitUnit(pseudoButton);
        }, this);

        this.twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.twoKey.onDown.add(function(){
            var pseudoButton = {unitName: 'archer'};
            this.recruitUnit(pseudoButton);
        }, this);

        this.threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.threeKey.onDown.add(function(){
            var pseudoButton = {unitName: 'pikeman'};
            this.recruitUnit(pseudoButton);
        }, this);

        this.fourKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.fourKey.onDown.add(function(){
            var pseudoButton = {unitName: 'knight'};
            this.recruitUnit(pseudoButton);
        }, this);

        // gain balance and and labels for it

        this.grainBalance = 20;

        this.balanceUnderlay = this.game.add.sprite(this.game.width*0.99, this.game.height*0.99, 'balanceUnderlay');
        this.balanceUnderlay.anchor.setTo(1, 1);

        this.balanceLabel = this.game.add.bitmapText(this.balanceUnderlay.centerX, this.balanceUnderlay.centerY, 'basicFont', ''+this.grainBalance, 24);
        this.balanceLabel.anchor.setTo(0.5, 0.5);
        this.balanceLabel.tint = 0xfff471;

        this.field.harvestSignal.add(function(amount){
            this.grainBalance += amount;
            this.balanceLabel.text = ''+this.grainBalance
        }, this);

        // set music
        this.game.swordHit = this.add.audio('swordStrike');
        this.game.zombieRoar = this.add.audio('zombieRoar');
        this.tapSound = this.add.audio('tap');

        //startting over lay

        this.startingOverlay = this.add.sprite(0, 0, 'startingScreen');
        this.startButton = this.add.button(this.game.width/2, this.game.height*0.65, 'startBut', this.startGame, this, 'out', 'out', 'down', 'out');
        this.startButton.anchor.setTo(0.5, 0.5);
        this.startButton.scale.setTo(0.6, 0.6);

        // loose overal
        this.looseOverlay = this.add.sprite(0, 0, 'looseOverlay');
        
        this.looseOverlay.alpha = 0;

        // win overlay
        this.winOverlay = this.add.sprite(0, 0, 'winOverlay');
        this.winOverlay.alpha = 0;
        this.restartButton = this.add.button(this.game.width/2, this.game.height*0.6, 'restartBut', this.restartGame, this, 'out', 'out', 'down', 'out');
        this.restartButton.anchor.setTo(0.5, 0.5);
        this.restartButton.scale.setTo(0.6, 0.6);
        this.restartButton.alpha = 0;
        this.restartButton.inputEnabled = false;

        // win conditions
        this.zombieProducingBarracks = 5;
        for (var j = 0; j<this.field.rows; j++) {
            this.field.map[j][8].endOfPoductionSignal.add(this.endOfBarracksProduction, this);
        }
    },

    update: function () {

        if (this.zombieProducingBarracks===0) {
            console.log('end of zombie production');
            if (this.field.getNumberOfZombies() ===0) {
                this.winGame();
            }
        }

              
    },

    startGame: function() {
        if (this.tapSound.isDecoded) {
            this.tapSound.play();
        }
        this.startingOverlay.alpha = 0;
        this.startButton.alpha = 0;
        this.startButton.inputEnabled = false;
        this.game.gameOnPause = false;
        this.field.planZombieProduction();

        this.squareUpdateCall = this.game.time.events.loop(10000, this.field.updateSquareStatus, this.field);
        //this.prickleCall = this.game.time.events.loop(1000, this.field.checkAndLaunchPrickle, this.field);
    },

    restartGame: function() {
        //console.log('restart game called');
        if (this.tapSound.isDecoded) {
            this.tapSound.play();
        }
        this.winOverlay.alpha = 0;
        this.looseOverlay.alpha = 0;
        this.restartButton.alpha = 0;
        this.restartButton.inputEnabled = false;
        
        this.field.reset();

        this.grainBalance = 20;
        this.balanceLabel.text = ''+this.grainBalance;
        this.game.gameOnPause = false;
        this.zombieProducingBarracks = 5;

        this.game.time.events.remove(this.squareUpdateCall, this);
        this.game.time.events.remove(this.prickleCall, this);

        this.field.planZombieProduction();

        this.squareUpdateCall = this.game.time.events.loop(10000, this.field.updateSquareStatus, this.field);
        //this.prickleCall = this.game.time.events.loop(1000, this.field.checkAndLaunchPrickle, this.field);

        //this.customTimer.resume();

    },

    looseGame: function() {

        //console.log('loose called');

        this.game.gameOnPause = true;
        this.looseOverlay.alpha = 1;
        this.restartButton.alpha = 1;
        this.restartButton.inputEnabled = true;
        //this.customTimer.pause();

    },

    winGame: function() {

        this.game.gameOnPause = true;
        this.winOverlay.alpha = 1;
        this.restartButton.alpha = 1;
        this.restartButton.inputEnabled = true;
        //this.customTimer.pause();

    },

    endOfBarracksProduction: function() {
        console.log('one barracks is over');
        this.zombieProducingBarracks -= 1;
    },

    recruitUnit: function(button) {

        if (this.tapSound.isDecoded) {
            this.tapSound.play();
        }

        var unitName = button.unitName;

        switch (unitName) {
            case 'militia':
                var costToRecruit = 10;        
                break;
            case 'archer':
                var costToRecruit = 20;
                break;
            case 'pikeman':
                var costToRecruit = 30;        
                break;
            case 'knight':
                var costToRecruit = 50;
                break;
        }

        if (this.grainBalance >= costToRecruit) {
            this.grainBalance -= costToRecruit;
            this.balanceLabel.text = ''+this.grainBalance;
            this.currentBarracks.createUnit(unitName);
        }        

    },

    setCurrentBarracks: function(pointer) {

        if (!this.game.gameOnPause) {
            var xPos = pointer.position.x,
                yPos = pointer.position.y;

            var xCoord = Math.round((xPos/this.field.squareSide) - 0.5),
                yCoord = Math.round((yPos/this.field.squareSide) - 0.5);

            if (xCoord === 0 && yCoord < 5) {

                if (this.currentBarracks) {
                    this.currentBarracks.tint = 0xffffff;
                }

                this.currentBarracks = this.field.map[yCoord][xCoord];
                this.currentBarracks.tint = 0xff0000;

                this.recruitPanel.alpha = 1;
                this.recruitMilitiaButton.inputEnabled = true;
                this.recruitArcherButton.inputEnabled = true;
                this.recruitPikemanButton.inputEnabled = true;
                this.recruitKnightButton.inputEnabled = true;
            }
        }
    }

};

Field = function(game, totalColumns, totalRows) {
    this.game = game;
    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.harvestSignal = new Phaser.Signal();
    this.zombieInTownSignal = new Phaser.Signal();

    this.map = [];
    for (var i = 0; i < totalRows; i++) {
        this.map[i] = [];
    }
    this.squareSide = 80

    this.soldiers = [];
    for (var i = 0; i < totalRows; i++) {
        this.soldiers[i] = [];
    }

    this.zombies = [];
    for (var i = 0; i < totalRows; i++) {
        this.zombies[i] = [];
    }

    this.columns = totalColumns;
    this.rows = totalRows;

    for (var j=0; j<this.rows; j++) {
        for (var i=0; i<this.columns; i++) {
            if (i===0) {
                this.addBarracks(i, j, 'player');
            } else if (i===this.columns-1) {
                this.addBarracks(i, j, 'ai');
            } else {
                this.addSquare(i, j);
            }
        }
    }

    this.updateSquareSowed();
};

Field.prototype = Object.create(Phaser.Group.prototype);
Field.prototype.constructor = Field;

Field.prototype.updateSquareStatus = function() {
    this.updateHarvest();
    this.updateSquareSowed();
    this.updateSquareCleaned();    
}

Field.prototype.planZombieProduction = function() {
    // background wave
    var lastBarracksIndex = null;
    for (var t = 1500; t<80000; t+=7000) {
        var barracksIndex = Math.round(Math.random()*4);
        while (lastBarracksIndex === barracksIndex) {
            barracksIndex = Math.round(Math.random()*4);
        }

        lastBarracksIndex = barracksIndex;

        if (t<17000) {
            var units = ['walker'];
        } else if (t<37000) {
            var units = ['walker', 'womit'];
        } else if (t<70000){
            var units = ['woody', 'womit'];
        } else {
            var units = ['prickle', 'womit'];
        }

        units.forEach(function(unit, index){
            this.map[barracksIndex][8].postponedUnitPoduction(t + index*500, unit);
        }, this);

        
    }
}

Field.prototype.checkAndLaunchPrickle = function() {
    for (var j = 0; j<this.rows; j++) {
        if (this.soldiers[j][0] && this.soldiers[j][0].key === 'knight') {
            var rowZombies = this.zombies[j],
                havePrickle = false;
                rowZombies.forEach(function(zombie){
                    if (zombie.key === 'prickle') havePrickle=true;
                }, this);

            if (!havePrickle) this.map[j][8].postponedUnitPoduction(100, 'prickle');

        }
    }
}

Field.prototype.addBarracks = function(column, row, type) {

    var xPos = (column + 0.5)*this.squareSide,
        yPos = (row + 0.5)*this.squareSide;

    switch(type) {
        case 'player':

            var barracks = new PlayerBarracks(this.game, xPos, yPos);
            break;

        case 'ai':

            var barracks = new ZombieBarracks(this.game, xPos, yPos);
            break;

    }

    this.add(barracks);
    this.map[row][column] = barracks;
    barracks.createSignal.add(this.addUnit, this);
}

Field.prototype.update = function() {
    if (!this.game.gameOnPause) {
        this.soldiers.forEach(function(row, rowIndex){
            row.forEach(function(soldier, index){

                if (index === 0 || soldier.interactionDistance>0) {

                    var speedLimit = this.checkFoeCollision(rowIndex, index, true);
                    if (speedLimit || speedLimit===0) {
                        if (index === 0) {
                            soldier.move(speedLimit);
                        }
                        soldier.attack(this.zombies[rowIndex][0]);
                        if (!this.zombies[rowIndex][0].alive) {
                            var zeroZombie = this.zombies[rowIndex].shift();
                            zeroZombie.destroy();
                        }
                    } else if (soldier.right < this.map[rowIndex][8].left){
                        if (index === 0) {
                            soldier.move(1000);
                        }
                    } else if (soldier.right >= this.map[rowIndex][8].left) {
                        soldier.reachEdge();
                    }

                } 

                if (index>0){

                    var speedLimit = this.checkAllyColiision(rowIndex, index, true);
                    if (speedLimit || speedLimit===0) {
                        //console.log('have speed limit');
                        soldier.move(speedLimit);
                    } else {
                        soldier.move(1000);
                    }
                }

            }, this);
            
        }, this);

        this.zombies.forEach(function(row, rowIndex){
            row.forEach(function(zombie, index){
                if (index === 0 || zombie.interactionDistance>0) {

                    var speedLimit = this.checkFoeCollision(rowIndex, index, false);
                    if (speedLimit || speedLimit===0) {
                        if (index===0) {
                            zombie.move(speedLimit);
                            this.spoilSquarePoint(zombie.x, zombie.y);
                        }
                        zombie.attack(this.soldiers[rowIndex][0]);
                        if (!this.soldiers[rowIndex][0].alive) {
                            var zeroSoldier = this.soldiers[rowIndex].shift();
                            zeroSoldier.destroy();
                        }
                    } else if (zombie.left>this.map[rowIndex][0].right){
                        if (index === 0) {
                            zombie.move(1000);
                            this.spoilSquarePoint(zombie.x, zombie.y);
                        }
                    } else if (zombie.left<=this.map[rowIndex][0].right) {

                        this.zombieInTownSignal.dispatch();
                    }

                } 

                if (index>0){

                    //console.log('non first zombie mobement')

                    var speedLimit = this.checkAllyColiision(rowIndex, index, false);
                    if (speedLimit || speedLimit===0) {
                        //console.log('collsion with ally');
                        //console.log('speed limit is '+speedLimit);
                        zombie.move(speedLimit);
                    } else {
                        //console.log('non restricted move');
                        zombie.move(1000);
                        this.spoilSquarePoint(zombie.x, zombie.y);
                    }
                }
            }, this);
        }, this);
    }
}

Field.prototype.addUnit = function(unit, side) {
    var yCoord = Math.round(unit.y/this.squareSide - 0.5);

    if (side==='player') {
        this.soldiers[yCoord].push(unit);
    } else {
        this.zombies[yCoord].push(unit);
    }
}

Field.prototype.spoilSquarePoint = function(xPos, yPos) {
    var xCoord = Math.round(xPos/this.squareSide - 0.5),
        yCoord = Math.round(yPos/this.squareSide - 0.5);

    if (xCoord<this.columns - 1 && xCoord > 0 && !this.map[yCoord][xCoord].spoiled) this.map[yCoord][xCoord].spoil();
}

Field.prototype.addSquare = function(column, row) {

    var xPos = (column + 0.5)*this.squareSide,
        yPos = (row + 0.5)*this.squareSide;

    var square = new Square(this.game, xPos, yPos);

    this.add(square);
    this.map[row][column] = square;
}

Field.prototype.updateHarvest = function() {

    for (var j in this.map) {
        for (var i in this.map[j]) {

            if (this.map[j][i].__proto__.constructor===Square && this.map[j][i].sowed) {

                this.map[j][i].gatherHarvest();
                this.harvestSignal.dispatch(5);

            }
        }
    }

}

Field.prototype.updateSquareSowed = function() {

    for (var j in this.map) {

        var lastSowIndex = 0;
        for (var i in this.map[j]) {

            if (this.map[j][i].__proto__.constructor===Square && this.map[j][i].sowed) {

                if (Number(i)>lastSowIndex) {
                    lastSowIndex = Number(i);
                }
            }

        }

        if (lastSowIndex === 0) {

            if (!this.map[j][1].spoiled) {
                console.log('sow from start');
                this.map[j][1].sow();    
            } else {
                console.log(this.map[j][1].spoiled);
            }            

        } else if (lastSowIndex<this.columns - 2) {

            if (!this.map[j][lastSowIndex + 1].spoiled) {

                this.map[j][lastSowIndex + 1].sow();

            }
            
        }
    }
}

Field.prototype.updateSquareCleaned = function() {

    var unspoilArray = []

    for (var j in this.map) {
        for (var i in this.map[j]) {

            if (this.map[j][i].__proto__.constructor===Square && this.map[j][i].spoiled) {

                if ((this.map[j][Number(i) - 1].__proto__.constructor===Square && !this.map[j][Number(i) - 1].spoiled) || i==1) {

                    unspoilArray.push([i, j]);

                }

            }
        }
    }

    for (var coor in unspoilArray) {
        var unspoilCoord = unspoilArray[coor];

        this.map[unspoilCoord[1]][unspoilCoord[0]].unspoil();
    }
}

Field.prototype.checkAllyColiision = function(rowIndex, index, player) {
    if (index>0) {
        if (player) {

            var unit = this.soldiers[rowIndex][index],
                checkAlly = this.soldiers[rowIndex][Number(index) - 1],
                distance = checkAlly.left - unit.right;

            if ((distance)<unit.speed) {

                return distance;

            }
        } else {

            var unit = this.zombies[rowIndex][index],
                checkAlly = this.zombies[rowIndex][Number(index) - 1];

            //console.log('check ally right '+checkAlly.right);
            //console.log('unit left '+unit.left);

            if ((unit.left - checkAlly.right)<unit.speed) {

                return unit.left - checkAlly.right;

            }

        }
        
    }

    return false;
}

Field.prototype.checkFoeCollision = function(rowIndex, index, player) {

    if (player) {
        var unit = this.soldiers[rowIndex][index],
            foe = this.zombies[rowIndex][0];

    } else {
        var unit = this.zombies[rowIndex][index],
            foe = this.soldiers[rowIndex][0];        
    }
    

    if (foe) {

        if (player) {

            if ((foe.left - unit.right)<=unit.speed + unit.interactionDistance) {

                return Math.max(0, foe.left - unit.right - unit.interactionDistance);
            } /*else {
                console.log('no collision with foe');
                console.log('foe left '+foe.left);
                console.log('unit right '+unit.right);
            }*/
        } else {

            if ((unit.left - foe.right)<=unit.speed + unit.interactionDistance) {

                return Math.max(0, unit.left - foe.right - unit.interactionDistance);
            }
        }
    }

    return false;

}

Field.prototype.getNumberOfZombies = function() {
    var numberOfZombies = 0;
    this.zombies.forEach(function(row){
        numberOfZombies += row.length;
    }, this);

    return numberOfZombies;
}

Field.prototype.reset = function() {
    

    for (var row = 0; row<this.rows; row++) {            
            this.map[row][8].clearProductionSchedule();
        }

    this.soldiers.forEach(function(row){
        row.forEach(function(soldier){
            if (soldier.arrow) {
                soldier.arrow.destroy();
            }
            soldier.destroy();
        }, this);        
    }, this)

    for (var row = 0; row<this.rows; row++) {
        this.soldiers[row] = [];
    }

    this.zombies.forEach(function(row){
        row.forEach(function(zombie){
            if (zombie.womitShot) {
                zombie.womitShot.destroy();
            }
            zombie.destroy();
        }, this);
    }, this)

    for (var row = 0; row<this.rows; row++) {
        this.zombies[row] = [];
    }

    for (var j = 0; j<this.rows; j++) {
        for (var i = 1; i<this.columns - 1; i++) {            
            this.map[j][i].clearSquare();
        }
    }

    console.log(this.map);

    this.updateSquareSowed();

    console.log(this.map);
}

Square = function(game, xPos, yPos) {
    this.game = game;

    Phaser.Sprite.call(this, game, xPos, yPos, 'square', 'clean');
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);

    this.sowed = false;
    this.spoiled = false;

    // harvest sign and tween
    this.harvestSign = this.game.add.bitmapText(this.x, this.y, 'basicFont', '+5', 24);
    this.harvestSign.anchor.setTo(0.5, 0.5);
    this.harvestSign.alpha = 0;    

}

Square.prototype = Object.create(Phaser.Sprite.prototype);
Square.prototype.constructor = Square;

Square.prototype.sow = function() {
    this.sowed = true;
    this.spoiled = false;
    this.frameName = 'sowed';
}

Square.prototype.unspoil = function() {
    console.log(this.frameName);
    this.spoiled = false;
    this.frameName = 'clean';
}

Square.prototype.spoil = function() {
    this.spoiled = true;
    this.sowed = false;
    this.frameName = 'spoiled';
    //console.log('spoil called');
}

Square.prototype.clearSquare = function() {
    //console.log('clear square called');
    this.spoiled = false;
    this.sowed = false;
    this.frameName = 'clean';
}

Square.prototype.gatherHarvest = function() {
    //console.log('gather harvest called');
    this.harvestSign.alpha = 1;

    var harvestTween = this.game.add.tween(this.harvestSign).to({y : '-100'}, 2000, Phaser.Easing.Linear.None, false);

    harvestTween.onComplete.add(function(){
        this.harvestSign.alpha = 0;
        this.harvestSign.position.set(this.x, this.y);
    }, this);

    harvestTween.start();
}

Barracks = function(game, xPos, yPos, barracksKey) {

    this.game = game;

    Phaser.Sprite.call(this, game, xPos, yPos, barracksKey);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);

    this.createSignal = new Phaser.Signal();
}

Barracks.prototype = Object.create(Phaser.Sprite.prototype);
Barracks.prototype.constructor = Barracks;

Barracks.prototype.createUnit = function(unitName) {
    if (this.availiableUnits.indexOf(unitName)>=0) {
        if (this.key==='playerBarracks') {
            switch (unitName) {
                case 'militia':
                    var unit = new Militia(this.game, this.x - this.width*0.48, this.y + this.height*0.48),
                        side = 'player';
                    break;

                case 'archer':
                    var unit = new Archer(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'player';
                    break;
                case 'pikeman':
                    var unit = new Pikeman(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'player';
                    break;
                case 'knight':
                    var unit = new Knight(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'player';
                    break;
            }
        } else if (this.key==='zombieBarracks') {
            switch (unitName) {
                case 'walker':
                    var unit = new Walker(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'zombie';
                    break;

                case 'womit':
                    var unit = new Womit(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'zombie';
                    break;

                case 'woody':
                    var unit = new Woody(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'zombie';
                    break;

                case 'prickle':
                    var unit = new Prickle(this.game, this.x- this.width*0.48, this.y + this.height*0.48),
                        side = 'zombie';
                    break;
            }
        }

        this.createSignal.dispatch(unit, side);
    }

    
}

PlayerBarracks = function(game, xPos, yPos) {

    Barracks.call(this, game, xPos, yPos, 'playerBarracks');
    this.availiableUnits = ['militia', 'archer', 'pikeman', 'knight'];
}

PlayerBarracks.prototype = Object.create(Barracks.prototype);
PlayerBarracks.prototype.constructor = PlayerBarracks;

ZombieBarracks = function(game, xPos, yPos) {

    Barracks.call(this, game, xPos, yPos, 'zombieBarracks');
    this.availiableUnits = ['walker', 'womit', 'prickle', 'woody'];

    this.productionCalls = [];    
    this.numberOfProductionCalls = 0;

    this.endOfPoductionSignal = new Phaser.Signal();

    //this.productionSequence = ['walker', 'walker', 'womit', 'prickle', 'woody', 'womit', 'walker', 'woody', 'womit', 'walker'];

    //var timeToProduce = 3000 + Math.round((Math.random() - 0.5)*1000);

    //this.productionCall = this.game.time.events.add(timeToProduce, this.postponedUnitPoduction, this);
}

ZombieBarracks.prototype = Object.create(Barracks.prototype);
ZombieBarracks.prototype.constructor = ZombieBarracks;

ZombieBarracks.prototype.postponedUnitPoduction = function(time, unit) {  
    var productionCall = this.game.time.events.add(time, function(){
        this.createUnit(unit);   
        this.numberOfProductionCalls -= 1;
        if (this.numberOfProductionCalls===0) {
            this.endOfPoductionSignal.dispatch();
        }
    }, this);    

    this.productionCalls.push(productionCall);
    this.numberOfProductionCalls ++;
}

ZombieBarracks.prototype.clearProductionSchedule = function() {
    this.productionCalls.forEach(function(prodCall){
        this.game.time.events.remove(prodCall, this);
    }, this);
}

BasicUnit = function(game, xPos, yPos, key, attackP, interactionDistance, healthP, shieldP, speed, direction) {

    this.game = game;

    Phaser.Sprite.call(this, game, xPos, yPos, key);
    game.add.existing(this);
    this.anchor.setTo(0, 1);

    this.attackP = attackP;
    this.interactionDistance = interactionDistance;
    this.healthP = healthP;
    this.currentHealth = healthP;
    this.shieldP = shieldP;
    this.speed = speed;
    this.direction = direction;
    this.readyToAttack = true;
    this.reachedEdge = false;

    // add animations
    this.runAnimation = this.animations.add('run', ['run_1', 'run_2', 'run_3', 'run_4', 'run_5', 'run_6'], 10, true);
    this.attackAnimation = this.animations.add('attack', ['attack_1', 'attack_2', 'attack_3'], 10, false);
    this.runAnimation.play();

    // add a health bar
    var healthBarGraphics = this.game.make.graphics(0, 0);
    healthBarGraphics.beginFill(0x00ff29);
    healthBarGraphics.drawRect(0, 0, 20, 5);
    healthBarGraphics.endFill();

    this.healthBar = this.game.make.sprite(0, -8 - this.height, healthBarGraphics.generateTexture());
    this.addChild(this.healthBar);
}

BasicUnit.prototype = Object.create(Phaser.Sprite.prototype);
BasicUnit.prototype.constructor = BasicUnit;

BasicUnit.prototype.move = function(speedLimit) {
    if (speedLimit>0 && this.runAnimation.paused && !this.attackAnimation.isPlaying && !this.reachedEdge) {
        this.runAnimation.paused = false;
        this.runAnimation.restart();
    }

    var currentSpeed = Math.min(speedLimit, this.speed);
    this.x += this.direction*currentSpeed;
}

BasicUnit.prototype.reachEdge = function() {
    if (!this.runAnimation.paused) {
        this.runAnimation.paused = true;
        this.reachedEdge = true;
        this.frameName = 'stand';
    }
}

BasicUnit.prototype.getAttacked = function(opAtP) {
    if (this.alive) {
        var damage = opAtP - this.shieldP;
        if (damage<0) damage = 0;
        this.currentHealth -= damage;
        this.healthBar.crop(new Phaser.Rectangle(0, 0, 20*this.currentHealth/this.healthP, 5));
        if (this.currentHealth < 0) {
            this.alive = false;
        }
    }
}

BasicUnit.prototype.die = function() {
    this.dieSignal.dispatch(this);
    if (this.arrow) {
        this.arrow.destroy();
    }
    if (this.womitShot) {
        this.womitShot.destroy();
    }
    this.destroy();
}

BasicUnit.prototype.attack = function(object) {

    if (this.readyToAttack) {
        if (this.runAnimation.isPlaying) {
            this.runAnimation.paused = true;
            this.attackAnimation.play();
            if (this.arrow) {
                this.arrow.position.set(this.x + this.width*0.2, this.y - this.height*0.7);
                this.arrow.alpha = 1;
                var flyTween = this.game.add.tween(this.arrow).to({x: object.x}, 300, Phaser.Easing.Linear.None, true);
                flyTween.onComplete.add(function(){
                    if (this) {
                        this.arrow.alpha = 0;
                    }
                }, this);
            }
            if (this.womitShot) {
                this.womitShot.position.set(this.x, this.y - this.height*0.8);
                this.womitShot.alpha = 1;
                var flyTween = this.game.add.tween(this.womitShot).to({x: object.x}, 300, Phaser.Easing.Linear.None, true);
                flyTween.onComplete.add(function(){
                    if (this) {
                        this.womitShot.alpha = 0;
                    }
                }, this);
            }
            this.attackAnimation.onComplete.add(function(){
                if (this) {
                    object.getAttacked(this.attackP);
                    this.frameName = 'stand';
                    if (this.direction> 0) {
                        if (this.game.swordHit.isDecoded && !this.game.swordHit.isPlaying) {
                            this.game.swordHit.play();
                        }
                    } else {
                        if (this.game.zombieRoar.isDecoded && !this.game.zombieRoar.isPlaying) {
                            this.game.zombieRoar.play();
                        }
                    }
                }
            }, this);
        }
        
        this.readyToAttack = false;

        this.game.time.events.add(500, function(){
            if (this) {
                this.readyToAttack = true;    
            }
            
        }, this);
    }

    
}

Militia = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'militia', 5, 0, 20, 0, 1, 1);
}

Militia.prototype = Object.create(BasicUnit.prototype);
Militia.prototype.constructor = Militia;

Archer = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'archer', 3, 80, 20, 0, 1, 1);

    this.arrow = this.game.add.sprite(this.x, this.y, 'arrow');
    this.arrow.alpha = 0;
}

Archer.prototype = Object.create(BasicUnit.prototype);
Archer.prototype.constructor = Archer;

Pikeman = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'pikeman', 7, 0, 20, 3, 0.5, 1);
}

Pikeman.prototype = Object.create(BasicUnit.prototype);
Pikeman.prototype.constructor = Pikeman;

Knight = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'knight', 10, 0, 20, 4, 0.5, 1);
}

Knight.prototype = Object.create(BasicUnit.prototype);
Knight.prototype.constructor = Knight;

Walker = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'walker', 4, 0, 20, 0, 0.5, -1);
}

Walker.prototype = Object.create(BasicUnit.prototype);
Walker.prototype.constructor = Walker;

Womit = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'womit', 3, 80, 20, 0, 1, -1);

    this.womitShot = this.game.add.sprite(this.x, this.y, 'womitShot');
    this.womitShot.alpha = 0;
}

Womit.prototype = Object.create(BasicUnit.prototype);
Womit.prototype.constructor = Womit;

Prickle = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'prickle', 13, 0, 10, 0, 1, -1);
}

Prickle.prototype = Object.create(BasicUnit.prototype);
Prickle.prototype.constructor = Prickle;

Woody = function(game, xPos, yPos) {
    BasicUnit.call(this, game, xPos, yPos, 'woody', 7, 0, 20, 2, 0.5, -1);
}

Woody.prototype = Object.create(BasicUnit.prototype);
Woody.prototype.constructor = Woody;


//below code is taken from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }
        else if (typeof this[i]==="number" && typeof array[i]==="number") {
            if (Math.abs(this[i]-array[i])>0.01) {
                return false;
            }            
        }
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

