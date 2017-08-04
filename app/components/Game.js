class Game {
  constructor(opt) {
    this.start =              opt.start;
    this.selection =          opt.selection;
    this.grid =               opt.grid;
    this.counting =           opt.counting;
    this.right =              opt.right;
    this.wrong =              opt.fawronglse;
    this.guess =              opt.guess;
    this.score =              opt.score;
    this.scoreRight =         opt.scoreRight;
    this.counter =            opt.counter;
    this.counterConst =       opt.counterConst;
    this.imgs =               opt.imgs;
    this.imgsCount =          opt.imgsCount;
    this.introTemplate =      fromDom(opt.introTemplate);
    this.startTemplate =      fromDom(opt.startTemplate);
    this.selectionTemplate =  fromDom(opt.selectionTemplate);
    this.gridTemplate =       fromDom(opt.gridTemplate);
    this.countingTemplate =   fromDom(opt.countingTemplate);
    this.rightTemplate =      fromDom(opt.rightTemplate);
    this.wrongTemplate =      fromDom(opt.wrongTemplate);
    this.guessTemplate =      fromDom(opt.guessTemplate);
    this.scoreTemplate =      fromDom(opt.scoreTemplate);
  }

  displayTemplate(boolean, template) {
    return boolean ? template.style.display = 'block' : template.style.display = 'none';
  }

  rendering() {
    this.displayTemplate(!this.start, this.introTemplate);
    this.displayTemplate(this.start, this.startTemplate);
    this.displayTemplate(this.counting, this.countingTemplate);
    this.displayTemplate(this.guess, this.guessTemplate);
    this.displayTemplate(this.grid, this.gridTemplate);
    this.displayTemplate(this.selection, this.selectionTemplate);
    this.displayTemplate(this.right, this.rightTemplate);
    this.displayTemplate(this.wrong, this.wrongTemplate);
    this.displayTemplate(this.score, this.scoreTemplate);
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

    function addImgToArray(array) {
      do {
        var randomNum = that.randomizer(1, that.imgsCount);
        var arrIndexOfRand = array[array.indexOf(randomNum)];
        if(arrIndexOfRand != randomNum) {
          that.isSame = true;
          array.unshift(randomNum);
          console.log('add');
          return;
        }
      } while (arrIndexOfRand == randomNum);   
    }

    // Ширина контейнера в зависимости от кол-ва картинок
    function containerWidth(array) {
      if(array.length > 9) {
        fromDom('.grid').style.width = '480px';
      }
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
    fromDom('#score-right').innerHTML = this.scoreRight;
    this.gridTemplate.querySelector('.grid').innerHTML = ''; // Удаляем все картинки
    this.start = true;
    this.counting = true;
    this.grid = true;
    this.selection = false;
    this.right = false;
    this.wrong = false;
    this.guess = false;
    this.rendering();
    addImgToArray(this.imgs);
    containerWidth(this.imgs);

    // Перетасовка массива и отрисовка
    this.imgs.sort((x, y) => Math.random()).forEach(i => {
      this.gridTemplate.querySelector('.grid').innerHTML += `
        <div class="grid-item" data-img="${i}">
          <img src="img/${i}.jpg">
          <div class="walls"></div>
          <div class="hard-walls"></div>
        </div>
      `;
    });

    // Изменения курсора
    fromDom('.grid-item').forEach(i => 
      i.classList.add('non-active'));

    // Задаем значение счетчику и отнимаем по одной единице
    counterInit(this.startTemplate.querySelector('#counter'), this.counter);
  }

  selections() {
    this.counting = false;
    this.selection = true;
    this.guess = true;
    this.rendering(); // Отрисовка
    this.random(); // Исполняем рандомную картинку
    fromDom('.grid-item').forEach(i => 
      i.classList.remove('non-active'));
    fromDom('.walls').forEach(i => 
      i.style.display = 'block');
  }

  random() {
    var rand = (min,max) => ~~(Math.random() * (max - min)) + min;
    // Рандомное число из количества картинок
    var randEl = rand(this.imgs[rand(0, this.imgs.length)]);
    fromDom('#t_guess').innerHTML = `<img data-guess="${randEl}" src="img/${randEl}.jpg">`;
    this.select();
  }

  select() {
    fromDom('.hard-walls').forEach(i => 
      i.style.display = 'none');
    // Число для угадывания
    var guess = fromDom('#t_guess').querySelector('img').getAttribute('data-guess');
    fromDom('.grid-item').forEach(i => {
      i.addEventListener('click', (e) => {

        if(e.target.getAttribute('data-img') === guess) { // Если правильный ответ
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
        this.selection = false; // Убираем шаблон выбора
        // Преврентим события по клику на картинках
        fromDom('.grid-item').forEach(i => i.style.pointerEvents = 'none');
        this.rendering();
        // Убираем крышку у правильного ответа
        fromDom(`[data-img="${guess}"]`).querySelector('.walls').style.display = 'none';
      });
    });
  }
}


