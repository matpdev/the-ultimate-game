import Phaser from "phaser";
import logoImg from "./assets/logo.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  /**
   * @type {Phaser.GameObjects.Rectangle}
   */
  player;
  /**
   * @type {Phaser.GameObjects.Rectangle}
   */
  player2;
  /**
   * @type {Phaser.Types.Input.Keyboard.CursorKeys}
   */
  cursors;
  cursorsp2;
  /**
   * @type {Phaser.GameObjects.Rectangle}
   */
  ball;
  group;

  preload() {
    //  This is an example of a bundled image:
    this.load.image("logo", logoImg);

    //  This is an example of loading a static image from the public folder:
    this.load.image("background", "assets/bg.jpg");
    this.load.spritesheet(
      "player",
      "assets/naruto_sprite_sheet_by_joshmedly_dbm5pgj-fullview.png",
      {
        frameHeight: 100,
        frameWidth: 100,
        spacing: 10,
      }
    );
  }

  create() {
    this.player = this.add.rectangle(
      window.innerWidth * 0.05,
      window.innerHeight / 2,
      60,
      300,
      0xffffff
    );

    this.player2 = this?.add.rectangle(
      window.innerWidth * 0.95,
      window.innerHeight / 2,
      60,
      300,
      0xffffff
    );

    this.ball = this.add.rectangle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      50,
      50,
      0xffffff
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursorsp2 = this.input.keyboard.addKeys("W,S");

    this.physics.add?.existing(this.player2);
    this.physics?.add.existing(this.player);
    this.physics.add?.existing(this.ball);

    this.player2.body.immovable = true;

    this.ball.body.setMaxVelocity(500, 500);

    this.player.body.collideWorldBounds = true;
    this.ball.body.collideWorldBounds = true;
    this.player2.body.collideWorldBounds = true;
    this.ball.body.onCollide = true;

    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
    this.ball.body.velocity.x = -300;

    this.player.body.immovable = true;

    this.physics.add.collider(this.player, this.ball);
    this.physics.add.collider(this.player2, this.ball);

    this.physics.world.on("collide", (g1, g2, b1, b2) => {
      const distance = new Phaser.Math.Vector2();
      const force = new Phaser.Math.Vector2();
      const acceleration = new Phaser.Math.Vector2();

      distance.copy(b2.center).subtract(b1.position);
      force
        .copy(distance)
        .setLength(5000000 / distance.lengthSq())
        .limit(1000);
      acceleration.copy(force).scale(5);
      b2.velocity.add(acceleration);
    });
  }

  update() {
    this.player?.body.setVelocity(0);

    if (this.cursors.up.isDown) {
      this.player?.body.setVelocityY(-400);
    } else if (this.cursors.down.isDown) {
      this.player?.body.setVelocityY(400);
    }

    this.player2?.body.setVelocity(0);

    if (this.cursorsp2.W.isDown) {
      this.player2?.body.setVelocityY(-400);
    } else if (this.cursorsp2.S.isDown) {
      this.player2?.body.setVelocityY(400);
    }
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  scene: MyGame,
  backgroundColor: "#000000",
  fps: {
    deltaHistory: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  fullscreenTarget: true,
});
