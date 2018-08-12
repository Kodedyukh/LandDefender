
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite((720 - 225)/2, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('titlepage', 'assets/images/background.png');	
		this.load.image('playerBarracks', 'assets/images/playerBarracks.png');
		this.load.image('zombieBarracks', 'assets/images/zombieBarracks.png');		
		
		this.load.image('recruitmentTip', 'assets/images/recruitmentTip.png');
		this.load.image('buttonUnderlay', 'assets/images/buttonUnderlay.png');
		this.load.image('balanceUnderlay', 'assets/images/balanceUnderlay.png');
		this.load.image('startingScreen', 'assets/images/startingScreen.png');
		this.load.image('looseOverlay', 'assets/images/looseOverlay.png');
		this.load.image('winOverlay', 'assets/images/winOverlay.png');
		this.load.image('womitShot', 'assets/images/womitShot.png');
		this.load.image('arrow', 'assets/images/arrow.png');

		this.load.atlas('startBut', 'assets/images/startBut.png', 'assets/images/startBut.json');
		this.load.atlas('restartBut', 'assets/images/restartButton.png', 'assets/images/restartButton.json');
		this.load.atlas('militiaBut', 'assets/images/militiaBut.png', 'assets/images/militiaBut.json');
		this.load.atlas('archerBut', 'assets/images/archerBut.png', 'assets/images/archerBut.json');
		this.load.atlas('pikemanBut', 'assets/images/pikemanBut.png', 'assets/images/pikemanBut.json');
		this.load.atlas('knightBut', 'assets/images/knightBut.png', 'assets/images/knightBut.json');
		this.load.atlas('square', 'assets/images/grassSquares.png', 'assets/images/grassSquares.json');
		this.load.atlas('button', 'assets/images/button.png', 'assets/images/button.json');
		this.load.atlas('militia', 'assets/images/militia.png', 'assets/images/militia.json');
		this.load.atlas('archer', 'assets/images/archer.png', 'assets/images/archer.json');
		this.load.atlas('pikeman', 'assets/images/pikeman.png', 'assets/images/pikeman.json');
		this.load.atlas('knight', 'assets/images/knight.png', 'assets/images/knight.json');
		this.load.atlas('womit', 'assets/images/womit.png', 'assets/images/womit.json');
		this.load.atlas('walker', 'assets/images/walker.png', 'assets/images/walker.json');
		this.load.atlas('woody', 'assets/images/woody.png', 'assets/images/woody.json');
		this.load.atlas('prickle', 'assets/images/prickle.png', 'assets/images/prickle.json');

		this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
		this.load.audio('backgroundMusic', ['assets/music/background.mp3']);
		this.load.audio('tap', ['assets/music/tap.mp3']);
		this.load.audio('swordStrike', ['assets/music/swordStrike.mp3']);
		this.load.audio('zombieRoar', ['assets/music/zombieRoar.mp3']);
		

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		/*if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;*/
			this.state.start('Game');
		/*}*/

	}

};

