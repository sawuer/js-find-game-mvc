var app = new Game({
  start:              false,
  selection:          false,
  grid:               false,
  counting:           false,
  right:              false,
  wrong:              false,
  guess:              false,
  score:              true,
  scoreRight:         0,
  counter:            0,
  counterConst:       0,
  imgs:               [],
  imgsCount:          30,
  introTemplate:      '#t_intro',
  startTemplate:      '#t_start',
  selectionTemplate:  '#t_selection',
  gridTemplate:       '#t_grid',
  countingTemplate:   '#t_counting',
  rightTemplate:      '#t_right',
  wrongTemplate:      '#t_wrong',
  guessTemplate:      '#t_guess',
  scoreTemplate:      '#t_score'
});


app.rendering()
app.addImagesToArray();

// app.startGame();
