var app = new Game({
  counter:        1,
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
});


app.rendering()
app.addImagesToArray();

// app.startGame();
