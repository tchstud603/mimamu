const puzzleId = "image_1"
const storageKey = `mimamu_${puzzleId}`;
const imagePath = "images/image1.png";

const words = ['559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd', '939bd3930c04c4b5a382216d62e117e9b4b77a83a3bb065007767078d940f7fd', '701efb4ebfd2d86ef491bfe163b10098790b839a26289bfbeb3ebc4bab62584e', '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf', 'ea325d761f98c6b73320e442b67f2a3574d9924716d788ddc0dbbdcaca853fe7', 'b4c3858f5f1e123198e835de04b87155d7a40e66e9b70805daf3ad439cd2fa3b', '9d0f44502d8625d3a501b4c7ef6e4db63c82de325376f0745ed6afc77383135b', 'b620c777c01fc24b2a87f97bf0b01aae4568591cf9082ff10a8318c04248c9ca', 'b1d6b91b67c2afa5e322988d9462638d354ddf8a1ef79dba987f815c22b4baee', 'b9776d7ddf459c9ad5b0e1d6ac61e27befb5e99fd62446677600d7cacef544d0', '5c0bc2423c1af18cd0172a4d1f84c01af25a3ee3c5ccd217e8e8a48924fe414e', '28391d3bc64ec15cbb090426b04aa6b7649c3cc85f11230bb0105e02d15e3624', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '4a69f19c8c264850d0f0fca1d7cd8ac0d07771cb9aaf5923c2c621a3e0f74475', 'fc59487712bbe89b488847b77b5744fb6b815b8fc65ef2ab18149958edb61464', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'a095c7713e337faa7c397ce5fc77edf4b5fad49409b53ef54f382ac3b5b60a03', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'a55e2e3846a51f6ad0abfdfbdea2ba0e5e0c76b5ccfa8a920895fedeae89a8b6', 'ff1b4a27562d8ffc821b4d7368818ad7c759cfc2068b7adf0d2712315d67359a', 'a965f7e58d4e9a47af1312bff76ba858499daf7c84343df3f20d77b44be22c53', 'b8d31e852725afb1e26d53bab6095b2bff1749c9275be13ed1c05a56ed31ec09', 'de2165ef8869e188a11655a966c6b8e60afbc31009a1f312f10ae38081069cdf']
const lengths = [1, 7, 7, 2, 2, 7, 4, 5, 2, 3, 5, 2, 1, 3, 4, 1, 7, 3, 1, 5, 6, 7, 2, 6]

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