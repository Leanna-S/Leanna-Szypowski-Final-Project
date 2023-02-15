// Shuffle function from http://stackoverflow.com/a/2450976
let shuffle = function (array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const cardContainer = document.getElementById("cards");
const allCards = [...cardContainer.querySelectorAll(".card")];
const nextCardToFind = document.getElementById("next-card");
const scoreBoard = document.getElementById("score");

// all the symbols possible
const possibleSymbols = [
  "atom",
  "frog",
  "feather-alt",
  "cogs",
  "anchor",
  "fan",
  "bolt",
  "hat-wizard",
  "apple-alt",
  "bell",
  "bomb",
  "brain",
];

// basic gameState
const boardState = {
  cards: [],
  cardsToFind: possibleSymbols,
  cardToFindIndex: 0,
  currentPlayerScore: 0,
  isWaiting: false,
};

function generateCardState() {
  // resets all cards
  boardState.cards = [];
  // generate each card state
  possibleSymbols.forEach((symbol) =>
    boardState.cards.push({
      cardSymbol: symbol,
      isMatched: false,
      isRevealed: false,
    })
  );
}

function onReset() {
  generateCardState();

  // shuffles the cards in the board state
  shuffle(boardState.cards);

  // this chunk function is only ran on reset, hence why i haven't moved it to the render function
  // renders the newly shuffled cards
  allCards.forEach((card, index) => {
    // removes previous icons and renders new one
    card.innerHTML = "";
    card.insertAdjacentHTML("beforeend", `<i class="fas fa-${boardState.cards[index].cardSymbol}"></i>`);
  });

  shuffle(boardState.cardsToFind);
  // resets score and the index of current
  boardState.cardToFindIndex = 0;
  boardState.currentPlayerScore = 0;
  renderGame();
}

function handleClick(element) {
  const currentCardSelected = boardState.cards[allCards.indexOf(element)];

  // checks for valid click
  if (currentCardSelected.isMatched === false && boardState.isWaiting === false) {
    boardState.isWaiting = true;
    // adds to score
    boardState.currentPlayerScore++;

    // reveals current card
    revealCard(currentCardSelected);
  }
}

function revealCard(currentCardSelected) {
  // reveals the current card
  currentCardSelected.isRevealed = true;

  renderGame();

  setTimeout(() => {
    // hides current card and allows for clicks to be registered again
    boardState.isWaiting = false;
    currentCardSelected.isRevealed = false;
    checkForMatch(currentCardSelected);
  }, 500);
}

function checkForMatch(currentCardSelected) {
  // checks in the current cards symbol and the card to find are the same
  if (currentCardSelected.cardSymbol === boardState.cardsToFind[boardState.cardToFindIndex]) {
    // changes matched to true
    currentCardSelected.isMatched = true;
    // changes the next card
    boardState.cardToFindIndex++;

    // we only check for win when there has been a new match, adds delay so all the classes change before the alert pops up
    checkForWin();
  }
  renderGame();
}

function checkForWin() {
  if (boardState.cards.every((card) => card.isMatched === true)) {
    setTimeout(() => alert(`You have won with a score of ${boardState.currentPlayerScore}`), 5);
  }
}

function renderGame() {
  // changes the classes for each card
  allCards.forEach((card, index) => {
    if (boardState.cards[index].isMatched === true) {
      // adds matched if the current card is matched
      card.classList.add("matched");
    } else if (boardState.cards[index].isRevealed === true) {
      // adds shown is the current card is shown
      card.classList.add("show");
    } else {
      // removes show and matched classes
      card.classList.remove("show");
      card.classList.remove("matched");
    }
  });

  // renders the next card
  nextCardToFind.innerHTML = "";
  nextCardToFind.insertAdjacentHTML("beforeend", `<i class="fas fa-${boardState.cardsToFind[boardState.cardToFindIndex]}"></i>`);

  // renders the scoreboard
  scoreBoard.textContent = boardState.currentPlayerScore;
}

document.querySelector(".restart").addEventListener("click", onReset);

cardContainer.addEventListener("click", (event) => {
  // checks what the event target is, and makes sure it is always LI that will be affected
  // nearest/closest - Thank you Alex
  if (event.target.tagName === "LI" || event.target.tagName === "I") {
    handleClick(event.target.closest("li"));
  }
});

onReset();
