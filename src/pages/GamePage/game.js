class GameStatistic {
  constructor() {
    this.isGameStarted = false;
    this.isGameEnded = false;
    this.numOfElementCaught = 0;
    this.targetEleId = '';
  }

  start() {
    this.isGameStarted = true;
  }

  end() {
    this.isGameEnded = true;
  }

  update() {
    this.numOfElementCaught += 1
  }

  aim(eleId) {
    this.targetEleId = eleId;
  }
}

export default GameStatistic;