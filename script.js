const puzzleId = "image_3"
const storageKey = `mimamu_${puzzleId}`;
const imagePath = "images/image3.png";

const words = ['2c46a91dc5c6930274259f8bfd4af2e357b609cfc6e07736972d34a8e3302c9a', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'd6a98598212ed729f5b9a4d1b7ff4dcc1341bbfc740993325b9107298521422f', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', '2c058d4dc63a9032a733d52d0d2b019dbf0d6faa07d9f0385bd1d0af35840c8f', '91ed2ef15eee7102873d33d852cae9a195eff25e758269de6457723b1d8dc29a', 'ea325d761f98c6b73320e442b67f2a3574d9924716d788ddc0dbbdcaca853fe7', '771ddab9b936047a7c44a06b0eacdf77b2d50f9bf5e73e539d0323e9b83d93d1', '247c7b26dca1b30b1cd8b008e86f99586dd9b43439df43d1a3fbc720a5fe5e7d', '1fe0ea1554f3f92bec526dc7b63f292c9f3d0d00b8db789c121b0d3e56eaa670', '34f874294f2f5bae3e29d5c5084b592d7981f85fcfc7872ea0216ceabde8f45c', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '5bd6502ccf37fa3f7db88b21c52ae7a43295ceabaf7292cb7d6758feb38f62d1', '021ad7e84521450daf25e279551937dc686f2b31600e8d20c3199715e828cbef', '663ea1bfffe5038f3f0cf667f14c4257eff52d77ce7f2a218f72e9286616ea39', '0d7157ac998fce4de37a327853c7e76c4503c28b8049b31db00ac77ea59a2f50', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'a095c7713e337faa7c397ce5fc77edf4b5fad49409b53ef54f382ac3b5b60a03', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'a55e2e3846a51f6ad0abfdfbdea2ba0e5e0c76b5ccfa8a920895fedeae89a8b6', 'ff1b4a27562d8ffc821b4d7368818ad7c759cfc2068b7adf0d2712315d67359a', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '4a69f19c8c264850d0f0fca1d7cd8ac0d07771cb9aaf5923c2c621a3e0f74475', 'fc59487712bbe89b488847b77b5744fb6b815b8fc65ef2ab18149958edb61464', '75857a45899985be4c4d941e90b6b396d6c92a4c7437aaf0bf102089fe21379d', 'fd963e4fd45949aa80c5da01f86dc754da4b243fdb90033c854c52c7e4927c9b', '223f8e72e18601bbb940b6fc03f8287cf766012fbb1ccdd62bfad1341f0ba663']
const lengths = [6, 1, 5, 3, 6, 6, 2, 7, 7, 10, 7, 1, 8, 7, 2, 9, 1, 7, 1, 5, 6, 3, 1, 3, 4, 4, 5, 5]

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

    localStorage.setItem(storageKey, JSON.stringify(gameState));
}

function loadGame() {

    const savedState = localStorage.getItem(storageKey);
    
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