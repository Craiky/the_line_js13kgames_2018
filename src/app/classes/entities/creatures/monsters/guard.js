import { Creature } from '.././creature';

let opposites = {
  e: 'w',
  w: 'e',
  n: 's',
  s: 'n'
};

let stuckCount = 0, dontChaseCount = 0, stuckAt = null, changeCount = 0, changedDirs = false;

export class Guard extends Creature {
  constructor(handler, x, y){
    super(handler, x, y);
    this.lastAnim = 'gleft';
    this.state = 2;
    this.speed = 90;
    this.start = { x: this.x, y: this.y };
    this.last = {};
    this.patrolDirs = Math.random() < .5 ? ['w', 'e'] : ['n', 's'];
    // this.patrolDirs = ['w', 'e'];
    this.patrolDir = rndIndex(this.patrolDirs);
    this.dir = {}
    this.offScreen = false;
    this.resetDir();
  }

  tick(dt) {
    super.tick(dt);
    if (!this.target) {
      this.target = this.handler.getWorld().getEntityManager().getPlayer();
    }

    this.xMove = this.yMove = 0;

    switch (this.state) {
      case 1: // 1 = patrol
        if (dontChaseCount < 60) dontChaseCount++;
        let p = stuckAt || this.patrolDir;
        this.dir[p] = true;
        this.patrol(dt);
        if (dontChaseCount >= 60) {
          stuckAt = null;
          this.checkStuck();
          this.checkForTarget();
        }
        this.move();
        break;
      case 2: // 2 = chase
        this.persue();
        this.checkStuck();
        this.patrol(dt);
        this.move();
        this.resetDir();
        break;
      // case 3: // 3 = moving around object
      //   stuckCount++;
      //   this.persue();
      //   this.patrol(dt);
      //   this.move();
      //   if (stuckCount > 120) {
      //     stuckCount = 0;
      //     this.state = 2;
      //   }
      //   break;
      }

  }

  render(g) {
    g.myDrawImage(this.frame('g'), this.x, this.y, TILE_SIZE, TILE_SIZE);

    // ****** DRAW BOUNDING BOX DON'T DELETE!!
    // g.fillStyle = "red";
    // g.fillRect(this.b.x + this.x, this.b.y + this.y, this.b.s, this.b.s);
    // ****** DRAW BOUNDING BOX DON'T DELETE!!
  }

  checkForTarget() {
    let t = this.target;
    let g = this;

    //if guard gets within X tiles of player change to chasing state
    if (
      Math.abs(t.x - g.x) < (TILE_SIZE * 3)
      && Math.abs(t.y - g.y) < (TILE_SIZE * 3)
    ) {
      this.state = 2; // 2 = chase
    }
  }

  persue() {
    let p = this.target;
    let closeOnX = (Math.abs(p.x - this.x) < 8);
    let closeOnY = (Math.abs(p.y - this.y) < 8);

    this.dir.n = (p.y < this.y) && !closeOnY;
    this.dir.e = (p.x > this.x) && !closeOnX;
    this.dir.s = (p.y > this.y) && !closeOnY;
    this.dir.w = (p.x < this.x) && !closeOnX;
  }

  checkStuck() {
    let xx = this.last.x == this.x;
    let yy = this.last.y == this.y;
    if (xx && yy) {
      stuckCount++;

      if (stuckCount > 15) {
        stuckAt = Object.keys(this.dir).find(x => this.dir[x]);
        this.changeDirection();
        this.resetDir();
        this.patrolDir = opposites[stuckAt];
        stuckCount = 0;
        dontChaseCount = 0;
        this.state = 1; // patrolling;
      }
    }

    this.last.x = this.x;
    this.last.y = this.y;
  }

  resetPos() {
    let s = this.start;

    this.x = s.x;
    this.y = s.y;
    dontChaseCount = 0;
    this.state = 1 // 1 = patrolling
  }

  resetDir() {
    this.dir = {
      n: false,
      e: false,
      s: false,
      w: false
    }
  }

  patrol(dt) {
    let d = this.dir;

    //north
    if (d.n) {
      this.yMove = -this.speed * dt;
    }

    //east
    if (d.e) {
      this.xMove = this.speed * dt;
    }

    //south
    if (d.s) {
      this.yMove = this.speed * dt;
    }

    //west
    if (d.w) {
      this.xMove = -this.speed * dt;
    }
  }

  changeDirection() {
    if (this.offScreen) {
      changeCount++;
    }

    if (changeCount > 60 || !this.offScreen) {
      let dir = this.dir;
      let prevDir = Object.keys(dir).find(x => dir[x]);

      dir[prevDir] = false;
      dir[opposites[prevDir]] = true;

      this.patrolDir = this.patrolDirs.filter(d => d !== prevDir)[0];

      this.offScreen = false;
      changeCount = 0;
    }
  }
}
