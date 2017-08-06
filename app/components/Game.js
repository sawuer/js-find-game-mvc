/**
 * Js find game MVC version
 */

var Game = (function() {
  // Dom query like Jquery dollar sign
  function $(el) {
    var all = document.querySelectorAll(el);
    return all.length > 1 ? all : document.querySelector(el);
  }

  /* ------------------- Model ------------------- */
  var Model = (function() {

    // private functions -------------------
    function randomizer(min,max) {
      return ~~(Math.random() * (max - min)) + min;
    }

    function randomFirstImg(count) {
      return randomizer(1, count);
    }
    // end of private functions -------------------

    // Public data (3) - (data, addFirstImage(), startGame())
    return {
      data: {
        scoreRight: 0,
        counter:    0,
        imgs:       [],
        imgsCount:  30,
      },

      addFirstImage() {
        var that = this;
        that.data.imgs.unshift(randomFirstImg(that.data.imgsCount));
      },

      startGame() {
        var that = this;

        function divWidthDependingOnImgs(array) {
          if(array.length > 9) {
            $('.grid').style.width = '480px';
          }
        }

        function addImgToArray(array, count) {
          do {
            var randomNum = randomizer(1, count);
            var arrIndexOfRand = array[array.indexOf(randomNum)];
            if (arrIndexOfRand != randomNum) {
              array.unshift(randomNum);
              return;
            }
          } while (arrIndexOfRand == randomNum);   
        }

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
            selections();
          }, counterData * 1000);
        }

        function addImgToTheGrid(arr) {
          arr.sort((a,b) => Math.random()).forEach(i => {
            $('.grid').innerHTML += `
              <div class="grid-item" data-img="${i}">
                <img src="img/${i}.jpg">
                <div class="walls"></div>
                <div class="hard-walls"></div>
              </div>
            `;
          });
        }

        function selections() {
          that.data.countingShow = false;
          that.data.selectionShow = true;
          that.data.guessShow = true;
          Controller.renderingController();
          imageThatNeedGuess(); 
          $('.grid-item').forEach(i => i.classList.remove('non-active'));
          $('.walls').forEach(i => i.style.display = 'block');
        }

        function imageThatNeedGuess() {
          var randImg = that.data.imgs[randomizer(0, that.data.imgs.length)];
          var html = `<img data-guess="${randImg}" src="img/${randImg}.jpg">`;
          $('#t_guess').innerHTML = html;
          select();
        }
        
        function select() {
          var selectedImg = $('#t_guess').querySelector('img').getAttribute('data-guess');
          var rightAnswerWall = $(`[data-img="${selectedImg}"]`).querySelector('.walls');
          $('.grid-item').forEach(i => {
            i.onclick = (e) => {
              if(e.target.getAttribute('data-img') === selectedImg) { 
                that.data.right = true;
                that.data.wrong = false;
                that.data.scoreRight++;
              } else { 
                that.data.wrong = true;
                that.data.right = false;
                that.data.scoreRight = 0;
                that.data.imgs = [];
                that.data.imgs.unshift(randomFirstImg());
                that.data.counter = 0;
              }
              that.data.selectionShow = false;
              $('.grid-item').forEach(i => i.style.pointerEvents = 'none');
              Controller.renderingController();
              rightAnswerWall.style.display = 'none';
            }
          });
        }
        // Init settings
        this.data.score = true;
        this.data.counter += 1;
        this.data.start = true;
        this.data.countingShow = true;
        this.data.grid = true;
        this.data.selectionShow = false;
        this.data.right = false;
        this.data.wrong = false;
        this.data.guessShow = false;
        $('.grid').innerHTML = '';
        $('#score-right').innerHTML = this.data.scoreRight;
        addImgToArray(this.data.imgs, this.data.imgsCount);
        divWidthDependingOnImgs(this.data.imgs);
        Controller.renderingController();
        counterInit($('#counter'), this.data.counter);
        addImgToTheGrid(this.data.imgs)
        $('.grid-item').forEach(i => i.classList.add('non-active'));

      }
    }
  }());
  /* ------------------- End of Model ------------------- */






  /* ------------------- View ------------------- */
  var View = (function() {
    // Public data
    return {
      temp: {
        introTemp:      '#t_intro',
        startTemp:      '#t_start',
        selectionTemp:  '#t_selection',
        gridTemp:       '#t_grid',
        countingTemp:   '#t_counting',
        rightTemp:      '#t_right',
        wrongTemp:      '#t_wrong',
        guessTemp:      '#t_guess',
        scoreTemp:      '#t_score'
      },
      display(bool, t) {
        if (bool) $(t).style.display = 'block'
        else $(t).style.display = 'none';
      }
    }
  }());
  /* ------------------- End of View ------------------- */






  /* ------------------- Controller ------------------- */
  var Controller = (function() {
    // Public data (3) - (renderingController(), startGameController(), addFirstImageController())
    return {
      renderingController() {
        View.display(!Model.data.start, View.temp.introTemp);
        View.display(Model.data.countingShow, View.temp.countingTemp);
        View.display(Model.data.guessShow, View.temp.guessTemp);
        View.display(Model.data.grid, View.temp.gridTemp);
        View.display(Model.data.selectionShow, View.temp.selectionTemp);
        View.display(Model.data.right, View.temp.rightTemp);
        View.display(Model.data.wrong, View.temp.wrongTemp);
        View.display(Model.data.score, View.temp.scoreTemp);
      },
      startGameController() {
        Model.startGame();
      },
      addFirstImageController() {
        Model.addFirstImage();
      }
    }
  }());
  /* ------------------- End of Controller ------------------- */





  // Game public object App
  return {
    App: (function() {
      // Public data
      return {
        start() {
          Controller.startGameController();
        },

        init() {
          Controller.renderingController();
          Controller.addFirstImageController();
        }
      }
    }())
  }



}());


