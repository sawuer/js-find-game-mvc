var Game = function(){
  var data = {
    scoreRight:     0,
    counter:        0,
    imgs:           [],
    imgsCount:      30,
    introTemp:      '#t_intro',
    startTemp:      '#t_start',
    selectionTemp:  '#t_selection',
    gridTemp:       '#t_grid',
    countingTemp:   '#t_counting',
    rightTemp:      '#t_right',
    wrongTemp:      '#t_wrong',
    guessTemp:      '#t_guess',
    scoreTemp:      '#t_score',
  }

  function rendering() {
    displayTemp(!data.start, data.introTemp);
    displayTemp(data.countingShow, data.countingTemp);
    displayTemp(data.guessShow, data.guessTemp);
    displayTemp(data.grid, data.gridTemp);
    displayTemp(data.selectionShow, data.selectionTemp);
    displayTemp(data.right, data.rightTemp);
    displayTemp(data.wrong, data.wrongTemp);
    displayTemp(data.score, data.scoreTemp);
  }

  function displayTemp(bool, temp) {
    return bool ? inDom(temp).style.display = 'block' : inDom(temp).style.display = 'none';
  }

  function randomizer(min,max) {
    return ~~(Math.random() * (max - min)) + min;
  }

  function randomFirstImg() {
    return randomizer(1, data.imgsCount);
  }
  

  function addImagesToArray() {
    data.imgs.unshift(randomFirstImg());
  }

  function startGame() {
    var scoreRight = inDom(data.scoreTemp).querySelector('#score-right');
    var grid = inDom(data.gridTemp).querySelector('.grid');
    var counter = inDom(data.countingTemp).querySelector('#counter');

    function addImgToArray(array) {
      do {
        var randomNum = randomizer(1, data.imgsCount);
        var arrIndexOfRand = array[array.indexOf(randomNum)];
        if(arrIndexOfRand != randomNum) {
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
        selections(); // Скрываем картинки и начинаем выбирать
      }, counterData * 1000);
    }
    
    data.score = true;
    data.counter += 1;
    data.start = true;
    data.countingShow = true;
    data.grid = true;
    data.selectionShow = false;
    data.right = false;
    data.wrong = false;
    data.guessShow = false;
    grid.innerHTML = '';
    scoreRight.innerHTML = data.scoreRight;
    addImgToArray(data.imgs);
    containerWidth(data.imgs);
    counterInit(counter, data.counter);
    rendering();

    data.imgs.sort(arrShuffle).forEach(i => {
      grid.innerHTML += `
        <div class="grid-item" data-img="${i}">
          <img src="img/${i}.jpg">
          <div class="walls"></div>
          <div class="hard-walls"></div>
        </div>
      `;
    });

    // Превент курсора для картинок
    inDom('.grid-item').forEach(i => i.classList.add('non-active'));
  }

  function selections() {
    data.countingShow = false;
    data.selectionShow = true;
    data.guessShow = true;
    rendering();
    imageThatNeedGuess(); 
    inDom('.grid-item').forEach(i => i.classList.remove('non-active'));
    inDom('.walls').forEach(i => i.style.display = 'block');
  }

  function imageThatNeedGuess() {
    var randNum = randomizer(0, data.imgs.length);
    var randImg = data.imgs[randNum];
    var html = `<img data-guess="${randImg}" src="img/${randImg}.jpg">`;
    inDom('#t_guess').innerHTML = html;
    select();
  }

  function select() {
    var selectedImg = inDom('#t_guess').querySelector('img').getAttribute('data-guess');
    var gridItem = inDom('.grid-item');
    var rightAnswerWall = inDom(`[data-img="${selectedImg}"]`).querySelector('.walls');

    gridItem.forEach(i => {
      i.addEventListener('click', (e) => {
        if(e.target.getAttribute('data-img') === selectedImg) { 
          data.right = true;
          data.wrong = false;
          data.scoreRight++;
        } else { 
          data.wrong = true;
          data.right = false;
          data.scoreRight = 0;
          data.imgs = [];
          data.imgs.unshift(randomFirstImg());
          data.counter = 0;
        }
        data.selectionShow = false;
        gridItem.forEach(i => i.style.pointerEvents = 'none');
        rendering();
        rightAnswerWall.style.display = 'none';
      });
    });
  }

  return {
    rendering,
    addImagesToArray,
    startGame
  }

}();


