var largeur = window.innerWidth;
var longueur = window.innerHeight;

$(window).ready(function() {
		$(".loader").fadeOut(4000, function(){
			$(".game").fadeIn(10000);
		})
	})
	
	var config = {
		type: Phaser.AUTO,
		width: largeur,
		height: longueur,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 300 },
				debug: false
			}
		},
		scene: {
			preload: preload,
			create: create,
			update: update
		}
	};

	var player;
	var stars;
	var OKbommer;
	var platforms;
	var cursors;
	var score = 0;
	var lose = false;
	var scoreText;
	var level = 0;
	var life = 3;

	var game = new Phaser.Game(config);

	function preload (){
		this.load.audio('start', 'musik/bruitages/ogg/start.ogg');
		this.load.audio('back', 'musik/ogg/mix2.ogg');
		this.load.audio('pieces', 'musik/bruitages/ogg/piece.ogg');
		this.load.audio('lvlUP', 'musik/bruitages/ogg/lvl_up.ogg');
		this.load.audio('DMG', 'musik/bruitages/ogg/MinecraftDMG.ogg');
		this.load.audio('loser', 'musik/bruitages/ogg/game_over.ogg');
		this.load.image('back1', 'img/back/back1.jpg');
		this.load.image('platform2', 'img/platform/platform2.PNG');
		this.load.image('star', 'img/star.png');
		this.load.image('bomb', 'img/bombWithoutBG.png');
		this.load.image('Noheart', 'img/heart/Noheart.png');
		this.load.image('Oneheart', 'img/heart/Oneheart.png');
		this.load.image('Twoheart', 'img/heart/Twoheart.png');
		this.load.image('Fullheart', 'img/heart/Fullheart.png');
		this.load.image('Home', 'img/BackHome.png');
		this.load.image('Refresh', 'img/RefreshInGame.png');
		this.load.spritesheet('dude', 'img/perso/panel1.png', { frameWidth: 32, frameHeight: 32 });	
	}

	function create (){
	//menu
		//retour accueil
		Home = this.add.image(1350, 16, 'Home');
		Home.visible = true;

		//refresh page
		Refresh = this.add.image(1400, 16, 'Refresh');
		Refresh.visible = true;
		
	//son du jeu
		//lancement jeu
		this.sound.play('start');

		//lvl up
		this.sound.add('lvlUP');

		//rammasage pièces
		this.sound.add('pieces');

		//choc avec la bombe
		this.sound.add('DMG');

		//game over
		this.sound.add('loser');
		
	//background
		//son
		this.sound.play('back');

		//image
		overlay1 = this.add.image(900, 500, 'back1');
		overlay1.visible = true;

    //platform
		platforms = this.physics.add.staticGroup();

	//bot mid
		platBotMid = platforms.create(600, 750, 'platform2').setScale(2).refreshBody();
		platBotMid.visible = true;

	//bot right 
		platBotRight = platforms.create(1300, 750, 'platform2').setScale(2).refreshBody();
		platBotRight.visible = true;

	//mid left
		platMidLeft = platforms.create(25, 550, 'platform2');
		platMidLeft.visible = true;

	//mid
		platMid = platforms.create(700, 400, 'platform2');
		platMid.visible = true;

	//mid right
		platMidRight = platforms.create(1200, 550, 'platform2');
		platMidRight.visible = true;

	//top left
		platTopLeft = platforms.create(40, 250, 'platform2');
		platTopLeft.visible = true;

	//top mid
		platTopMid = platforms.create(710, 220, 'platform2');
		platTopMid.visible = true;

	//top right
		platTopRight = platforms.create(1400,200, 'platform2');
		platTopRight.visible = true;

    // personnage
		player = this.physics.add.sprite(50, 450, 'dude');
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

    //les animations perso
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 14 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 2 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 26 }),
			frameRate: 10,
			repeat: -1
		});

    //évenement clavier
		cursors = this.input.keyboard.createCursorKeys();
		
	//niveau
		levelText = this.add.text(16, 40, 'Level :0', { fontSize: '32px', fill: '#FFFFFF' });

	//gestion étoile
		stars = this.physics.add.group({
			key: 'star',
			repeat: 22,
			setXY: { x: 12, y: 0, stepX: 70 }
		});
		
	//gestion de rebond des étoiles
		stars.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		OKbommer = this.physics.add.group();

    //score
		scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });
		
	//vie
		Full = this.add.image(800,30, 'Fullheart');
		Full.visible = true;
		Two = this.add.image(800,30, 'Twoheart');
		Two.visible = false;
		One = this.add.image(800,30, 'Oneheart');
		One.visible = false;
		No = this.add.image(800,30, 'Noheart');
		No.visible = false;

    //collision (perso/platform)
		this.physics.add.collider(player, platforms);

	//collision (pieces/platform)
		this.physics.add.collider(stars, platforms);

	//collision (bomb/platform)
		this.physics.add.collider(OKbommer, platforms);

    //collecte étoile
		this.physics.add.overlap(player, stars, collectStar, null, this);
	
	//choc avec la bombe
		this.physics.add.collider(player, OKbommer, hitBomb, null, this);
	}
	
	function update (){
		if (lose == true){
			this.sound.play('loser');
			var msg = confirm("Game Over");
			if(msg == true){
				window.location.assign('index.html');
			}
			return msg;
		}

		//gestion clavier et animations du personnage
		if (cursors.left.isDown){
			player.setVelocityX(-160);
			player.anims.play('left', true);
		}
		else if (cursors.right.isDown){
			player.setVelocityX(160);
			player.anims.play('right', true);
		}
		else if(cursors.down.isDown){
			player.setVelocityY(330);
			player.anims.play('turn');
		}
		else{
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		if (cursors.up.isDown && player.body.touching.down){
			player.setVelocityY(-330);
		}
	}

	function collectStar (player, star){
		star.disableBody(true, true);
		
		this.sound.play('pieces',{volume : 0.3});

    	//évolution score
		score += 10;
		scoreText.setText('Score: ' + score);

		if (stars.countActive(true) === 0){		
			
			level = 1;
			Level = levelText.setText('Level: ' + level);

        	//apparition nouvelles étoiles 
			stars.children.iterate(function (child) {
				child.enableBody(true, child.x, 0, true, true);
			});

			//son de passage de niveau
			//this.sound.play('lvlUP');
			
			var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

			//gestion bombe
			var bomb = OKbommer.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;

		}
	}

	function hitBomb (player, bomb){
		life = life - 1;
		if(life == 2){
			Full.visible = false;
			this.sound.play('DMG');
			Two.visible = true;
		}
		else if(life == 1){
			Two.visible = false;
			this.sound.play('DMG');
			One.visible = true;
		}
		else if(life == 0){
			One.visible = false;
			this.sound.play('DMG');
			No.visible = true;
		}	
		
		if(No.visible == true){
			player.visible = false;
			lose = true;
		}
	}