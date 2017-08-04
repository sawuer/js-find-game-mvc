const 
  props = {
    start:        false,
    selection:    false,
    grid:         false,
    counting:     false,
    right:        false,
    wrong:        false,
    guess:        false,
    score:        true,
    scoreRight:   0,
    counter:      0,
    counterConst: 0,
    imgs:         []
  },

  templates = {
    intro:      fromDom('#t_intro'),
    start:      fromDom('#t_start'),
    selection:  fromDom('#t_selection'),
    grid:       fromDom('#t_grid'),
    counting:   fromDom('#t_counting'),
    right:      fromDom('#t_right'),
    wrong:      fromDom('#t_wrong'),
    guess:      fromDom('#t_guess'),
    score:      fromDom('#t_score')
  },

  mechanics = {
    
    /**
     * Return random number
     */ 
    randomizer(min,max) {
      return ~~(Math.random() * (max - min)) + min;
    },

    randomFirstImg() {
      return mechanics.randomizer(1, 30);
    },

    // Отрисовка с условиями
    displayTemplate(boolean, template) {
        return boolean ? template.style.display = 'block' : template.style.display = 'none';
    },
    
    // Исполнение отрисовки
    rendering() {
      this.displayTemplate(!props.start, templates.intro);
      this.displayTemplate(props.start, templates.start);
      this.displayTemplate(props.counting, templates.counting);
      this.displayTemplate(props.guess, templates.guess);
      this.displayTemplate(props.grid, templates.grid);
      this.displayTemplate(props.selection, templates.selection);
      this.displayTemplate(props.right, templates.right);
      this.displayTemplate(props.wrong, templates.wrong);
      this.displayTemplate(props.score, templates.score);
    },

    startGame() {
      /**
       * Up array count 
       */
      function addImgToArray(array) {
        var randomNum = mechanics.randomizer(1, 8);
        for(var i = 0; i <= array.length; i++) {
          if(randomNum == array[i]) {
            if(array.length == 1) array.unshift(randomNum + 1);
            return;
          }
        }
        array.unshift(randomNum);
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
          if(htmlCounter.innerText > 0) htmlCounter.innerText = count--;
        }, 1000);
        setTimeout(() => {
          clearInterval(counterInterval);
          mechanics.selection(); // Скрываем картинки и начинаем выбирать
        }, counterData * 1000);
      }

      props.counter += 1;
      fromDom('#score-right').innerHTML = props.scoreRight;
      templates.grid.querySelector('.grid').innerHTML = ''; // Удаляем все картинки
      props.start = true;
      props.counting = true;
      props.grid = true;
      props.selection = false;
      props.right = false;
      props.wrong = false;
      props.guess = false;
      this.rendering();
      addImgToArray(props.imgs);
      containerWidth(props.imgs);

      // Перетасовка массива и отрисовка
      props.imgs.sort((x, y) => {
        return Math.random();
      }).forEach(i => {
        templates.grid.querySelector('.grid').innerHTML += `
          <div class="grid-item" data-img="${i}">
            <img src="img/${i}.jpg">
            <div class="walls"></div>
            <div class="hard-walls"></div>
          </div>
        `;
      });
      // Изменения курсора
      fromDom('.grid-item').forEach(i => i.classList.add('non-active'));
      // Задаем значение счетчику и отнимаем по одной единице
      counterInit(templates.start.querySelector('#counter'), props.counter);
    }, // End of startGame

    selection() {
      props.counting = false;
      props.selection = true;
      props.guess = true;
      this.rendering(); // Отрисовка
      this.random(); // Исполняем рандомную картинку
      fromDom('.grid-item').forEach(i => i.classList.remove('non-active'));
      fromDom('.walls').forEach(i => i.style.display = 'block');
    },

    random() {
      var rand = (min,max) => ~~(Math.random() * (max - min)) + min;
      // Рандомное число из количества картинок
      var randEl = rand(props.imgs[rand(0, props.imgs.length)]);
      fromDom('#t_guess').innerHTML = `<img data-guess="${randEl}" src="img/${randEl}.jpg">`;
      this.select();
    },

    select() {
      fromDom('.hard-walls').forEach(i => i.style.display = 'none');
      // Число для угадывания
      var guess = fromDom('#t_guess').querySelector('img').getAttribute('data-guess');
      fromDom('.grid-item').forEach(i => {
        i.addEventListener('click', (e) => {

          if(e.target.getAttribute('data-img') === guess) { // Если правильный ответ
            props.right = true;
            props.wrong = false;
            props.scoreRight++;
          } else { 
            props.wrong = true;
            props.right = false;
            props.scoreRight = 0;
            props.imgs = [];
            props.imgs.unshift(this.randomFirstImg());
            props.counter = props.counterConst;
          }
          props.selection = false; // Убираем шаблон выбора
          // Преврентим события по клику на картинках
          fromDom('.grid-item').forEach(i => i.style.pointerEvents = 'none');
          this.rendering();
          // Убираем крышку у правильного ответа
          fromDom(`[data-img="${guess}"]`).querySelector('.walls').style.display = 'none';
        });
      });
    }
};




props.imgs.unshift(mechanics.randomFirstImg());
