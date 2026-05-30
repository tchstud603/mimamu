const puzzleId = "image_2"
const storageKey = `mimamu_${puzzleId}`;
const imagePath = "images/image2.png";

const words = ['ae25d6481fc1741ffee4a95cd05de7b6375f7e1b0c63c006640b366094f2c4a9', 'c82d3d4865e41e2a263ff0427c4df2b8e3e43a85c835404d033d764468b3ba55', '3cdc6d6e23e0f9475e986208c25b453d7aca1b947d527659c718359b91c81c06', '293b9207228b7854bc3ccb2959ebea1583e066d41983124a5b381d6fdf6575f8', '6ffd1195204be8c726e773a30fe7d32cd60a3973dd956d03b99af472f18251b5', 'd52a38e07759542b9896e19b793ad428b80717f06f6071f78fbb000ba990c7d0', 'f4bf9f7fcbedaba0392f108c59d8f4a38b3838efb64877380171b54475c2ade8', 'b9776d7ddf459c9ad5b0e1d6ac61e27befb5e99fd62446677600d7cacef544d0', '8cb6279a8e1b12a9677497cc5c71e90337f2dfad637b35a9d1be0b0668a85f06', '889393fb69a5b305188405f66dd58ca1fefad6cef46cfbf85236146e633f2a66', '0021e0469a49c5187b4b1f1b3d22fdae35096fb9364b6e091560ed15dc658e14', 'b1d6b91b67c2afa5e322988d9462638d354ddf8a1ef79dba987f815c22b4baee', 'b9776d7ddf459c9ad5b0e1d6ac61e27befb5e99fd62446677600d7cacef544d0', 'd35ca5051b82ffc326a3b0b6574a9a3161dee16b9478a199ee39cd803ce5b799', '701efb4ebfd2d86ef491bfe163b10098790b839a26289bfbeb3ebc4bab62584e', '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'c685a2c9bab235ccdd2ab0ea92281a521c8aaf37895493d080070ea00fc7f5d7', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', 'c006c7e3ab14d686f63524136f1ec7c5e553d839bc01c851e4dc9de2bdbfc589', '21839e0eb260dda7a564eef13fa1ae94970a32834064cfc8437e636cfe7533fb', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '28720365c5e7476a011e4f43ac003ee5f16247a263b9d623aa85ed311d73bf39', '18e1dd392168f601d0e568612a2bf40e6555c033e033b580ae6627d8aeee1150', '0695b563acde461fc2f8d9aebccf35c7596ac458b8d8e067c602fb7b4e5f1578', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '939bd3930c04c4b5a382216d62e117e9b4b77a83a3bb065007767078d940f7fd', '02f777505493dc76c8d24a2e654c8d61d02514e24d1fdfe9937384536083260e']
const lengths = [7, 10, 11, 6, 9, 5, 2, 3, 7, 6, 8, 2, 3, 6, 7, 2, 1, 6, 3, 5, 4, 3, 1, 3, 3, 4, 1, 7, 6]

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