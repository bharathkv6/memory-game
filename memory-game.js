const startButton = document.querySelector('.start-btn');
const gridContainer = document.querySelector('.grid-container');
let level = 0;
let score = 0;
let highscore = 0;
let isPlaying = false;
let activeBlocks = [];
let clickCounter = -1;

const generateRandomNumbers = () => {
  return Math.floor(Math.random() * (4 - 0 + 1) + 0);
};

const setScores = function () {
  document.querySelector('.score-count').textContent = score;
  document.querySelector('.highscore-count').textContent = highscore;
};

const dimBlock = function (blockId) {
  gridContainer.children[blockId].classList.remove('blink-on');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const highlightBlock = function (blockId) {
  gridContainer.children[blockId].classList.add('blink-on');
  return new Promise(resolve => {
    setTimeout(async () => {
      await dimBlock(blockId);
      resolve();
    }, 500);
  });
};

const highlightBlocks = async function () {
  isPlaying = true;
  for (let i = 0; i < level; i++) {
    const randomNumber = generateRandomNumbers();
    activeBlocks.push(randomNumber);
    await highlightBlock(randomNumber);
  }
  isPlaying = false;
};

const highlightWrongBlock = function (blockId) {
  gridContainer.classList.add('shake');
  gridContainer.children[blockId].classList.add('wrong');
  return new Promise(resolve => {
    setTimeout(() => {
      gridContainer.classList.remove('shake');
      gridContainer.children[blockId].classList.remove('wrong');
      resolve();
    }, 500);
  });
};

const handleStart = function () {
  startButton.disabled = true;
  clickCounter = -1;
  level++;
  activeBlocks = [];
  highlightBlocks();
};

const resetGame = function () {
  score = 0;
  level = 0;
  setScores();
};

const handleBlockClick = function (e) {
  if (isPlaying) return;
  if (e.target.matches('.grid-container > div')) {
    clickCounter++;
    const index = Number(e.target.dataset.index);
    if (index !== activeBlocks[clickCounter]) {
      highlightWrongBlock(index).then(() => {
        startButton.disabled = false;
        resetGame();
      });
      return;
    }
    gridContainer.children[index].classList.add('blink-on');
    setTimeout(() => {
      gridContainer.children[index].classList.remove('blink-on');
    }, 500);
    if (clickCounter + 1 === activeBlocks.length) {
      score++;
      if(score > highscore) {
        highscore = score;
      }
      setScores();
      setTimeout(() => {
        handleStart();
      }, 2000);
    }
  }
};

const init = function () {
  setScores();
  startButton.addEventListener('click', handleStart);
  gridContainer.addEventListener('click', handleBlockClick);
};

init();
