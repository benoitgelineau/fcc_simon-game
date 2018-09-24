(function() {

  const game = {

    init: function() {
      this.cacheDom();
      this.sounds();
      this.bindEvents();
    },
    cacheDom: function() {

      this.onoffBtn = document.getElementById('on-off');
      this.startBtn = document.getElementById('start');
      this.strictBtn = document.getElementById('strict');
      this.turnScreen = document.getElementById('turn');
      this.pads = document.getElementsByClassName('pad');

    },
    sounds: function() {

      this.redSound = new Sound('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
      this.blueSound = new Sound('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
      this.yellowSound = new Sound('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
      this.greenSound = new Sound('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

    },
    bindEvents: function() {

      this.onoffBtn.addEventListener('click', this.isOn.bind(this));
      this.startBtn.addEventListener('click', this.startGame.bind(this));
      this.strictBtn.addEventListener('click', this.setStrict.bind(this));

      for (let pad of this.pads) {
        pad.addEventListener('click', this.human.bind(this));
      }

    },
    isOn: function() { // Turns everything on or off

      if (this.isActive(this.onoffBtn)) {
        this.cancelAll();
      } else {
        this.onoffBtn.classList.add('active');
        this.turnScreen.classList.add('active');
      }
    },
    startGame: function() { // Sets starting game

      this.turn = 1;

      if (this.isActive(this.onoffBtn)) {

        if (!this.isActive(this.startBtn)) {
          this.startBtn.classList.add('active');
        }
        this.melody = [];
        this.huMelody = [];
        this.format(this.turn);

        setTimeout(() => { this.startMelody(); }, 1000);

      }
    },
    setStrict: function() { // Sets strict mode

      if (this.isActive(this.onoffBtn)) {
        if (this.isActive(this.strictBtn)) {
          this.strictBtn.classList.remove('active');
        } else {
          this.strictBtn.classList.add('active');
        }
      }
    },
    startMelody: function() { // Starts playing sounds with exception turn 1

      if (this.turn === 1) {
        this.firstTurn();
      } else {
        this.playMelody(true);
      }

    },
    firstTurn: function() { // Add first sound to melody array and plays it

      this.addSound();

      const pad = this.pads[this.melody[0]],
            color = this.pads[this.melody[0]].classList[1];

      this.playSound(pad, color);
      setTimeout(() => { this.removeActive(); }, 1000);

      this.setClickable(true);

      console.log(`First sound: ${this.melody}`);
    },
    playMelody: function(correct) { // Plays sounds on melody array
      let speed = 1000;

      this.setClickable(false);

      this.count = 0;

      if (correct) {
        this.addSound();
        this.turn++;
      }

      if (this.turn >= 13) { // Increases speed as turns are increasing
        speed = 500;
      } else if (this.turn >= 9) {
        speed = 650;
      } else if (this.turn >= 5) {
        speed = 800;
      }
      console.log(`Melody on turn ${this.turn}: ${this.melody}`);

      this.interval = setInterval(() => {
        this.compute();
        this.count++;
      }, speed);

      this.format(this.turn);

    },
    human: function(evt) { // Event when player clicks on a pad
      const pad = evt.target,
            color = evt.target.classList[1];

      if (pad.classList[2] === 'clickable') {

        this.playSound(pad, color);
        setTimeout(() => { this.removeActive(); }, 300);
        this.addHuSound(evt);

        if (this.evaluate()) { // Starts a new turn if right order of entire melody array
          if (this.melody.length === this.huMelody.length) {
            if (this.turn === 20) { // Ends game at turn 20
              this.turnScreen.textContent = '**';
              this.startBtn.classList.remove('active');
              setTimeout(() => {
                this.startGame();
              }, 5000);

            } else {
              this.huMelody = [];
              setTimeout(() => { this.playMelody(true); }, 1000);
            }

          }
        } else { // Replays sounds if wrong order

          this.turnScreen.textContent = '!!';

          if (this.isActive(this.strictBtn)) { // Restarts game if false in strict mode

            setTimeout(() => { this.startGame(); }, 1000);

          } else {

            this.huMelody = [];
            setTimeout(() => {
              this.format(this.turn);
              this.playMelody(false);
            }, 1000);
          }

        }
      }

    },
    compute: function() { // Plays each sound and stops when count reaches turn

      if (this.count === this.turn) {
        clearInterval(this.interval);
        console.log('stop interval');
        this.removeActive();
        this.setClickable(true);

      } else {

        const pad = this.pads[this.melody[this.count]],
              color = this.pads[this.melody[this.count]].classList[1];

        this.removeActive();
        this.playSound(pad, color);

      }
    },
    evaluate: function() { // Compares melody to human melody

      for (let i = 0; i < this.huMelody.length; i++) {
        if (this.huMelody[i] !== this.melody[i]) {
          return false;
        }
      }
      return true;
    },
    addSound: function() { // Add random number into melody array
      const random = this.getRandomInt(4);

      this.melody.push(random);
    },
    addHuSound: function(evt) { // Add sound into human melody array

      for (let i = 0; i < this.pads.length; i++) {
        if (this.pads[i] === evt.target) {
          this.huMelody.push(i);
        }
      }
      console.log(this.huMelody);
    },
    playSound: function(pad, color) { // Add active class on pad and plays corresponding sound

      pad.classList.add('active');

      switch (color) {
        case 'red':
          this.redSound.play();
          break;
        case 'blue':
          this.blueSound.play();
          break;
        case 'yellow':
          this.yellowSound.play();
          break;
        case 'green':
          this.greenSound.play();
          break;
      }
    },
    setClickable: function(bool) { // Enables/Disables click on pads

      for (let pad of this.pads) {
        if (bool) {
          pad.classList.add('clickable');
        } else {
          pad.classList.remove('clickable');
        }
      }
    },
    isActive: function(obj) {
      return obj.classList[0] === 'active';
    },
    removeActive: function() { // Remove active class on pads

      for (let pad of this.pads) {
        for (let i = 0; i < pad.classList.length; i++) {
          if (pad.classList[i] === 'active') {
            pad.classList.remove('active');
          }
        }
      }
    },
    cancelAll: function() {

      this.onoffBtn.classList.remove('active');
      this.startBtn.classList.remove('active');
      this.strictBtn.classList.remove('active');
      this.turnScreen.classList.remove('active');
      this.turnScreen.textContent = '--';
      clearInterval(this.interval);
      this.removeActive();
      this.setClickable(false);
      this.melody = [];
      this.huMelody = [];

    },
    format: function(step) {

      step = step < 10 ? '0' + step : step;
      this.turnScreen.textContent = step;

    },
    getRandomInt: function(max) { // Random function
      return Math.floor(Math.random() * Math.floor(max));
    },
  };

  game.init();

  function Sound(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    };
  }

})();
