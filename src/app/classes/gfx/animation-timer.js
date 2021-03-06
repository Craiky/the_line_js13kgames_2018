let c = 0, machine = null;

export class AnimationTimer {
  constructor() {
    this.frames = 2;
    this.index = 0;
    this.lastTime = Date.now();
    this.timer = 0;
    this.speed = 240;
    this.keys = 0;
    this.stop = false;
    this.beats = {
      1: [
      ],
      //sounds on the 1.5 beat
      2: [
        { name: 'steamLow', condition(k) { return true }},
        { name: 'bassC', condition(k) { return k <= 3 }},
        { name: 'endBassC', condition(k) { return k > 4 }},
      ],
      3: [
        { name: 'arpFsG', condition(k) { return k == 0 }},
      ],
      //sounds on the 2.5 beat
      4: [
        // { name: 'arpFsG', condition(k) { return k == 3 }},
        { name: 'bassDs', condition(k) { return k <= 1 }},
        { name: 'stabFACD', condition(k) { return k > 4 }},
      ],
      5: [
        { name: 'arpAsC', condition(k) { return k == 0 }},
      ],
      //sounds on the 3.5 beat
      6: [
        { name: 'steamHigh', condition() { return true}},
        { name: 'bassDs', condition(k) { return k > 1 && k < 3}},
        { name: 'bassFs', condition(k) { return k <= 1 }},
        { name: 'endBassF', condition(k) { return k > 4 }},
      ],
      7: [
      ],
      //sounds on the 4.5 beat
      8: [
        { name: 'bassDs', condition(k) { return k <= 2 }},
      ],
    }
  }

  init(handler) {
    this.sounds = handler.getSoundManager();
  }

  tick() {
    if (!this.stop) {
      if (machine) {
        machine = this.handler.getMachine();
      }

      this.timer += Date.now() - this.lastTime;
      this.lastTime = Date.now();

      if (this.timer >= this.speed){
        if (this.sounds) this.factoryNoise();
        this.index++;
        this.timer = 0;
        if (this.index >= this.frames)
          this.index = 0;
      }
    }
  }

  factoryNoise() {
    c++;

    this.playAll(this.beats[c]);
    if (c == 8) c = 0;
  }

  playAll(s){
    let sm = this.sounds;
    let k = this.keys;

    // if (k >= 4) return;

    for (let i = 0; i < s.length; i++) {
      if (s[i].condition(k)) {
        sm.load(s[i].name);
        sm.play(s[i].name);
      }
    }
  }

  keyAdded() {
    this.keys++;
    this.speed += 20;
  }
}
