class Game {
  constructor(opt) {
    this.score =          true;
    this.scoreRight =     0;
    this.counter =        opt.counter-1;
    this.counterConst =   this.counter;
    this.imgs =           [];
    this.imgsCount =      opt.imgsCount + 1;
    this.introTemp =      fromDom(opt.introTemp);
    this.startTemp =      fromDom(opt.startTemp);
    this.selectionTemp =  fromDom(opt.selectionTemp);
    this.gridTemp =       fromDom(opt.gridTemp);
    this.countingTemp =   fromDom(opt.countingTemp);
    this.rightTemp =      fromDom(opt.rightTemp);
    this.wrongTemp =      fromDom(opt.wrongTemp);
    this.guessTemp =      fromDom(opt.guessTemp);
    this.scoreTemp =      fromDom(opt.scoreTemp);
  }

  displayTemp(bool, temp) {
    return bool ? temp.style.display = 'block' 
                : temp.style.display = 'none';
  }

  rendering() {
    this.displayTemp(!this.start, this.introTemp);
    this.displayTemp(this.countingShow, this.countingTemp);
    this.displayTemp(this.guessShow, this.guessTemp);
    this.displayTemp(this.grid, this.gridTemp);
    this.displayTemp(this.selectionShow, this.selectionTemp);
    this.displayTemp(this.right, this.rightTemp);
    this.displayTemp(this.wrong, this.wrongTemp);
    this.displayTemp(this.score, this.scoreTemp);
  }

  randomizer(min,max) {
    return ~~(Math.random() * (max - min)) + min;
  }

  randomFirstImg() {
    return this.randomizer(1, this.imgsCount);
  }
  
  addImagesToArray() {
    this.imgs.unshift(this.randomFirstImg());
  }

  startGame() {
    var that = this;
    var scoreRight = this.scoreTemp.querySelector('#score-right');
    var grid = this.gridTemp.querySelector('.grid');
    var counter = this.countingTemp.querySelector('#counter');

    function addImgToArray(array) {
      do {
        var randomNum = that.randomizer(1, that.imgsCount);
        var arrIndexOfRand = array[array.indexOf(randomNum)];
        if(arrIndexOfRand != randomNum) {
          that.isSame = true;
          array.unshift(randomNum);
          return;
        }
      } while (arrIndexOfRand == randomNum);   
    }

    // Ширина контейнера в зависимости от кол-ва картинок
    function containerWidth(array) {
      if(array.length > 9) {
        grid.style.width = '480px';
      }
    }

    // Перемешка для аррэя
    function arrShuffle() {
      return Math.random();
    }

    // Инициалзиация счетчика
    function counterInit(htmlCounter, counterData) {
      var count = htmlCounter.innerText = counterData;
      htmlCounter.innerText = count--;
      var counterInterval = setInterval(() => {
        if(htmlCounter.innerText > 0) {
          htmlCounter.innerText = count--;
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(counterInterval);
        that.selections(); // Скрываем картинки и начинаем выбирать
      }, counterData * 1000);
    }

    this.counter += 1;
    this.start = true;
    this.countingShow = true;
    this.grid = true;
    this.selectionShow = false;
    this.right = false;
    this.wrong = false;
    this.guessShow = false;
    this.rendering();
    grid.innerHTML = '';
    scoreRight.innerHTML = this.scoreRight;
    addImgToArray(this.imgs);
    containerWidth(this.imgs);
    counterInit(counter, this.counter);

    this.imgs.sort(arrShuffle).forEach(i => {
      grid.innerHTML += `
        <div class="grid-item" data-img="${i}">
          <img src="img/${i}.jpg">
          <div class="walls"></div>
          <div class="hard-walls"></div>
        </div>
      `;
    });

    // Превент курсора для картинок
    fromDom('.grid-item').forEach(i => 
      i.classList.add('non-active'));
  }

  selections() {
    this.countingShow = false;
    this.selectionShow = true;
    this.guessShow = true;
    this.rendering();
    this.imageThatNeedGuess(); 
    fromDom('.grid-item').forEach(i => i.classList.remove('non-active'));
    fromDom('.walls').forEach(i => i.style.display = 'block');
  }

  imageThatNeedGuess() {
    var randNum = this.randomizer(0, this.imgs.length);
    var randImg = this.imgs[randNum];
    var html = `<img data-guess="${randImg}" 
                src="img/${randImg}.jpg">`;
    fromDom('#t_guess').innerHTML = html;
    this.select();
  }

  select() {
    var selectedImg = fromDom('#t_guess').querySelector('img').getAttribute('data-guess');
    var gridItem = fromDom('.grid-item');
    var rightAnswerWall = fromDom(`[data-img="${selectedImg}"]`).querySelector('.walls');

    gridItem.forEach(i => {
      i.addEventListener('click', (e) => {
        if(e.target.getAttribute('data-img') === selectedImg) { 
          this.right = true;
          this.wrong = false;
          this.scoreRight++;
        } else { 
          this.wrong = true;
          this.right = false;
          this.scoreRight = 0;
          this.imgs = [];
          this.imgs.unshift(this.randomFirstImg());
          this.counter = this.counterConst;
        }
        this.selectionShow = false;
        gridItem.forEach(i => i.style.pointerEvents = 'none');
        this.rendering();
        rightAnswerWall.style.display = 'none';
      });
    });
  }

}


