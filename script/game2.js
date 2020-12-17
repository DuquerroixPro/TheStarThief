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
	var player2;
	var stars;
	var OKbommer;
	var platforms;
	var cursors;
	var score = 0;
	var lose = false;
	var scoreText;
	var level = 0;
	var life = 6;
	var Haut;
	var Bas;
	var Gauche;
	var Droite;
	
	var game = new Phaser.Game(config);

	function preload (){
		this.load.audio('start', 'musik/bruitages/ogg/start.ogg');
		this.load.audio('back', 'musik/ogg/mix2.ogg');
		this.load.audio('pieces', 'musik/bruitages/ogg/piece.ogg');
		this.load.audio('lvlUP', 'musik/bruitages/ogg/lvl_up.ogg');
		this.load.audio('DMG', 'musik/bruitages/ogg/MinecraftDMG.ogg');
		this.load.audio('loser', 'musik/bruitages/ogg/game_over.ogg');
		this.load.image('back', 'img/back/back.jpg');
		this.load.image('back1', 'img/back/back1.jpg');
		this.load.image('back2', 'img/back/back2.jpg');
		this.load.image('back3', 'img/back/back3.jpg');
		this.load.image('back4', 'img/back/back4.jpg');
		this.load.image('back5', 'img/back/back5.jpg');
		this.load.image('back6', 'img/back/back6.jpg');
		this.load.image('platform2', 'img/platform/platform2.PNG');
		this.load.image('star', 'img/star.png');
		this.load.image('bomb', 'img/bombWithoutBG.png');
		this.load.image('Noheart', 'img/heart/Noheart.png');
		this.load.image('Oneheart', 'img/heart/Oneheart.png');
		this.load.image('Twoheart', 'img/heart/Twoheart.png');
		this.load.image('Fullheart', 'img/heart/Fullheart.png');
		this.load.spritesheet('dude', 'img/perso/panel4.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('perso', 'img/perso/panel4.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('end', 'img/particules.jpg');
	}

	function create (){
	//son du jeu
		//lancement jeu
		this.sound.play('start');
		//lvl up
		this.sound.add('lvlUP');
		//rammasage pièces
		this.sound.add('pieces');
		//game over
		this.sound.add('loser');
		
	//background
		//son
		this.sound.play('back');
		//image
		overlay = this.add.image(900, 500, 'back');
		overlay.visible = true;
		overlay1 = this.add.image(900, 500, 'back1');
		overlay1.visible = false;
		overlay2 = this.add.image(900, 500, 'back2');
		overlay2.visible = false;
		overlay3 = this.add.image(900, 500, 'back3');
		overlay3.visible = false;
		overlay4 = this.add.image(900, 500, 'back4');
		overlay4.visible = false;
		overlay5 = this.add.image(900, 500, 'back5');
		overlay5.visible = false;
		overlay6 = this.add.image(900, 500, 'back6');
		overlay6.visible = false;

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
		player = this.physics.add.sprite(500, 450, 'dude');
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);
		this.physics.add.collider(player, platforms);
		
		player2 = this.physics.add.sprite(100, 450, 'perso');
        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);
        this.physics.add.collider(player2, platforms);

    //les animations
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 21, end: 23 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 10 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 33, end: 35 }),
			frameRate: 10,
			repeat: -1
		});
		
	//les animations perso 2
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('perso', { start: 21, end: 23 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'perso', frame: 10 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('perso', { start: 33, end: 35 }),
			frameRate: 10,
			repeat: -1
		});	

    //évenement clavier
		cursors = this.input.keyboard.createCursorKeys();
		
		Haut = this.input.keyboard.addKey('Z');
		Bas = this.input.keyboard.addKey('S');
		Gauche = this.input.keyboard.addKey('Q');
		Droite = this.input.keyboard.addKey('D');
		
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
		
		Full2 = this.add.image(920,30, 'Fullheart');
		Full2.visible = true;
		Two2 = this.add.image(920,30, 'Twoheart');
		Two2.visible = false;
		One2 = this.add.image(920,30, 'Oneheart');
		One2.visible = false;	
		No2 = this.add.image(920,30, 'Noheart');
		No2.visible = false;
	
    //collecte étoile
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, collectStar, null, this);
		this.physics.add.overlap(player2, stars, collectStar, null, this);
	
	//choc avec la bombe
		this.physics.add.collider(OKbommer, platforms);
		this.physics.add.collider(player, OKbommer, hitBomb, null, this);
		this.physics.add.collider(player2, OKbommer, hitBomb, null, this);
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
		//gestion clavier et animations du personnage pour le 1er joueur
		if (cursors.left.isDown)  {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
		else if(cursors.down.isDown){
			player.setVelocityY(330);
			player.anims.play('turn');
		}
        else  {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
	//gestion clavier et animations du personnage pour le 2 eme joueur
		if (Gauche.isDown){
			player2.setVelocityX(-160);
			player2.anims.play('left', true);
		}
		else if (Droite.isDown){
			player2.setVelocityX(160);
			player2.anims.play('right', true);
		}
		else if(Bas.isDown){
			player2.setVelocityY(330);
			player2.anims.play('turn');
		}
		else{
			player2.setVelocityX(0);
			player2.anims.play('turn');
		}
		if (Haut.isDown && player.body.touching.down){
			player2.setVelocityY(-330);
		}
	}

	function collectStar (player, star){
		star.disableBody(true, true);

		this.sound.play('pieces',{volume : 0.3});
    //évolution score
		score += 10;
		scoreText.setText('Score: ' + score);

		if (stars.countActive(true) === 0){
		
			level = level +1;
			Level = levelText.setText('Level: ' + level);
        //apparition nouvelles étoiles 
			stars.children.iterate(function (child) {
				child.enableBody(true, child.x, 0, true, true);
			});
			
		//son lvl up
			this.sound.play('lvlUP');
		//changement fond
			if(level == 1){
				overlay.visible = false;
				overlay1.visible = true;
			}
			else if(level == 2){
				overlay1.visible = false;
				overlay2.visible = true;
			}
			else if(level == 3){
				overlay2.visible = false;
				overlay3.visible = true;
			}
			else if(level == 4){
				overlay3.visible = false;
				overlay4.visible = true;
			}
			else if(level == 5){
				overlay4.visible = false;
				overlay5.visible = true;
			}
			else if(level == 6){
				overlay5.visible = false;
				overlay6.visible = true;
			}

			var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
		//gestion bombe
			var bomb = OKbommer.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;

		}
	}

	function hitBomb (playerTouch, bomb){
		life = life - 1;
		if(life == 5){
			Full2.visible = false;
			this.sound.play('DMG');
			Two2.visible = true;
			Full.visible = true;
		}
		else if(life == 4){
			Two2.visible = false;
			this.sound.play('DMG');
			One2.visible = true;
			Full.visible = true;
		}
		else if(life == 3){
			One2.visible = false;
			this.sound.play('DMG');
			No2.visible = true;
			Full.visible = true;
		}	
		else if(life == 2){
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
		if(No2.visible == true && No.visible == true){
			playerTouch.anims == false;
			playerTouch.visible = false;
			lose = true
		}
	}