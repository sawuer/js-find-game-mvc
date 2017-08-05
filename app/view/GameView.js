var GameView = `
  <t id="t_intro">
    <h2>Ты готов?</h2>
    <button onclick="Game.startGame()"Продолжить>Начать игру</button>
  </t>

  <t id="t_start">

    <t id="t_counting">
      <h2>Старт!</h2>
      <h1 id="counter"></h1>
    </t>

    <t id="t_score">
      <span id="score-right">0</span>
    </t>

    <t id="t_selection">
      <h2>Угадывай!</h2>
    </t>

    <t id="t_right">
      <h2>Правильно)))</h2>
      <button onclick="Game.startGame()" class="restart">Продолжить</button>
    </t>

    <t id="t_wrong">
      <h2>Неправильно(((</h2>
      <button onclick="Game.startGame()" class="restart">Заново</button>
    </t>

    <t id="t_guess"></t>

    <t id="t_grid">
        <div class="grid"></div>
    </t>

  </t>
`;
