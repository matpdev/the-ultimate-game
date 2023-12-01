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
  /**
   * @type {Phaser.GameObjects.Rectangle}
   */
  boxPointP1;
  /**
   * @type {Phaser.GameObjects.Rectangle}
   */
  boxPointP2;
  /**
   * @type {Phaser.GameObjects.Text}
   */
  textPoints;

  points = {
    p1: getCookie("p1") ?? 0,
    p2: getCookie("p2") ?? 0,
  };

  preload() {}

  create() {
    this.textPoints = this.add.text(
      window.innerWidth / 2 - 100,
      window.innerHeight * 0.1,
      `${this.points.p1} - ${this.points.p2}`,
      {
        fontSize: 50,
      }
    );
    this.start();
  }

  addPoints(val, p) {
    this.points[p] = val;
    this.textPoints.text = `${this.points.p1} - ${this.points.p2}`;

    setCookie(p, val, 1);
  }

  start() {
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

    this.boxPointP1 = new Phaser.Geom.Rectangle(
      0,
      window.innerHeight / 2,
      50,
      window.innerHeight
    );
    this.boxPointP2 = new Phaser.Geom.Rectangle(
      window.innerWidth,
      window.innerHeight / 2,
      50,
      window.innerHeight
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

    this.physics.add.collider([this.player, this.player2], this.ball);
    this.physics.add.collider(this.boxPointP1, this.ball);
    this.physics.add.collider(this.boxPointP2, this.ball);

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

    /**
     * @type {Phaser.Geom.Rectangle}
     */
    const intersection = Phaser.Geom.Intersects.GetRectangleIntersection(
      this.boxPointP1,
      this.ball
    );

    const intersection2 = Phaser.Geom.Intersects.GetRectangleIntersection(
      this.boxPointP2,
      this.ball
    );

    this.verifyOverlap(intersection);

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

  /**
   * @param {Phaser.Geom.Rectangle} intersection
   */

  verifyOverlap(intersection) {
    let initialVal = this.points;

    if (intersection.x > 0 && intersection.x <= 50) {
      this.addPoints(this.points.p1 + 1, "p1");
      this.scene.restart();
    } else if (
      intersection.x >= window.innerWidth - 50 &&
      intersection.x <= window.innerWidth
    ) {
      this.addPoints(this.points.p1 + 2, "p2");
      this.scene.restart();
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

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
