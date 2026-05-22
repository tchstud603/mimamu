const imagePath = "images/pilot.png";

const words = ['559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd', '48735c4fae42d1501164976afec76730b9e5fe467f680bdd8daff4bb77674045', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd', '0eb129bf94594aaeee66e38361d7be212cd927c3df4dd92e3ded2e0da0c7ad88', '0db79e63c5179b1263619f693ca7125017237cec447946bdb40a8d3175c1773d', 'c1aade8253979ee2f3959f043676c44454925643d62f6baef75a45afc170b666', '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf', '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd', '237ab3365842e475721a65d4a2a2623b2c4b24bf063cbfdc7c78dde01f95df93']
const lengths = [1, 3, 3, 1, 3, 7, 5, 2, 1, 6]

const guessedWords = new Array(words.length).fill(false);
const displayWords = new Array(words.length).fill("");

const imageElement = document.getElementById("game-image");
const sentenceContainer = document.getElementById("sentence-container");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const guessArea = document.querySelector(".guess-area");
const message = document.getElementById("message");

imageElement.src = imagePath;

function renderSentence() {

    sentenceContainer.innerHTML = "";

    for (let i = 0; i < words.length; i++) {
        if (guessedWords[i]) {
            const solvedWord = document.createElement("span");

            solvedWord.classList.add("solved-word");
            solvedWord.textContent = displayWords[i];
            sentenceContainer.appendChild(solvedWord);
        } else {
            const wordBox = document.createElement("div");

            wordBox.classList.add("word-box");
            wordBox.style.width = (lengths[i] * 20) + "px";
            wordBox.textContent = lengths[i];
            sentenceContainer.appendChild(wordBox);
        }
    }
}

async function guessWord() {
    const userGuess = guessInput.value.trim();

    if (userGuess === "") {
        return;
    }

    const hashedGuess = await sha256(userGuess);

    for (let i = 0; i < words.length; i++) {
        if (words[i] === hashedGuess) {
            guessedWords[i] = true;
            displayWords[i] = userGuess;
        }
    }

    guessInput.value = "";

    renderSentence();
    checkWin();
    saveGame();
}

function checkWin() {
    if (!guessedWords.includes(false)) {
        guessArea.style.display = "none";
        message.textContent = "You solved it!";
    }
}

async function sha256(word) {
  const msgBuffer = new TextEncoder().encode(word);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer)); 
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

guessButton.addEventListener("click", guessWord);

guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        guessWord();
    }
});

function saveGame() {

    const gameState = {

        guessedWords: guessedWords,
        displayWords: displayWords

    };

    localStorage.setItem("mimamu_state", JSON.stringify(gameState));
}

function loadGame() {
    const saved  = localStorage.getItem("mimamu_state");

    if (saved) {

    }
}

function loadGame() {

    const savedState = localStorage.getItem("mimamu_state");

    if (savedState === null) {
        return;
    }

    const gameState = JSON.parse(savedState);

    for (let i = 0; i < guessedWords.length; i++) {

        guessedWords[i] = gameState.guessedWords[i];
        displayWords[i] = gameState.displayWords[i];
    }
}

loadGame();
renderSentence();
checkWin();