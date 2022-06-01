'use strict';

function getWord() {
    // possible to get the same word twice since we're not keeping
    // track of what's been used previously
    const wordIndex = Math.floor(Math.random() * wordList.length);
    const selectedWord = wordList[wordIndex];
    console.log(`Word: ${selectedWord} at index[${wordIndex}]`);
    return selectedWord;
}

function userNotice(message) {
    const alertEl = document.querySelector('.alert');
    alertEl.innerText = message;
    alertEl.style.display = "block";
    setTimeout(() => { alertEl.style.display = "none"; }, 3000);
}

function Row(rowId) {
    this.rowId = rowId;
    this.currentIndex = 1;
    this.maxIndex = 5;
    this.getFirstCell = () => {
        return document.querySelector(`#${this.rowId} :nth-child(1)`);
    };
    this.getNextCell = () => {
        if (this.currentIndex >= this.maxIndex) {
            return document.querySelector(`#${this.rowId} :nth-child(5)`);
        }

        this.currentIndex++;
        return document.querySelector(`#${this.rowId} :nth-child(${this.currentIndex})`);
    };
    this.getPreviousCell = () => {
        if (this.currentIndex <= 1) {
            return document.querySelector(`#${this.rowId} :nth-child(1)`);
        }

        this.currentIndex--;
        return document.querySelector(`#${this.rowId} :nth-child(${this.currentIndex})`);
    };
    this.updateCell = (letter) => {
        const currentCell = this.getCurrentCell();
        currentCell.innerText = letter;
    };
    this.getCurrentCell = () => {
        return document.querySelector(`#${this.rowId} :nth-child(${this.currentIndex})`);
    };
    this.isComplete = () => {
        if (this.currentIndex < 5) {
            return false;
        }

        return this.getCurrentCell().innerText != '';
    };
    this.getUserWord = () => {
        const allCells = Array.from(document.querySelectorAll(`#${this.rowId} div.letter`));
        let userWord = '';
        allCells.forEach(e => {
            userWord += e.innerText;
        });
        return userWord.toLowerCase();
    };
    this.matches = (matchWord) => {
        return  this.getUserWord() == matchWord;
    };
    this.isValidWord = () => {
        return wordList.includes(this.getUserWord());
    };
    this.colorCells = (matchWord) => {
        const userWord = this.getUserWord().split('');
        const matchWordArr = matchWord;
        userWord.forEach((val, index) => {
            if (matchWordArr.charAt(index) == val) {
                document.querySelector(`#${this.rowId} :nth-child(${index+1})`).classList.add('green');
            } else if (matchWordArr.indexOf(val) > 0) {
                document.querySelector(`#${this.rowId} :nth-child(${index+1})`).classList.add('orange');
            } else {
                document.querySelector(`#${this.rowId} :nth-child(${index+1})`).classList.add('grey');
            }
        })
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const todaysWord = getWord();
    let rowIndex = 1;
    let row = new Row(`row${rowIndex}`);
    let puzzleDone = false;

    const keys = document.querySelectorAll(".key");
    keys.forEach(elem => {
        elem.addEventListener('click', (evt) => {
            // once complete, ignore keystrokes
            if (puzzleDone) return;
            
            const letter = evt.currentTarget.innerText;
            switch (letter) {
                case 'DEL':
                    if (row.getCurrentCell().innerText === "") {
                        row.getPreviousCell();
                    }
                    row.updateCell('');
                    break;
                case 'ENTER':                
                    if (row.isComplete()) {
                        if (row.matches(todaysWord)) {
                            row.colorCells(todaysWord);
                            puzzleDone = true;
                            switch (rowIndex) {
                                case 1:
                                    userNotice('Genius!')
                                    break;
                                case 2:
                                    userNotice('Magnificent!')
                                    break;
                                case 3:
                                    userNotice('Impressive!')
                                    break;
                                case 4:
                                    userNotice('Splendid!')
                                    break;
                                case 5:
                                    userNotice('Great!')
                                    break;
                                default:
                                    userNotice('Phew!')
                                    break;
                            }
                            console.log(`Success! Today's word was ${todaysWord}`);
                        } 
                        else if (row.isValidWord()) {
                            row.colorCells(todaysWord);
                            rowIndex++;
                            row.rowId = `row${rowIndex}`;
                            row.currentIndex = 1;
                            // TODO: fill in used keys
                        } else {
                            userNotice(`Not a valid word, try again`);
                        }
                    } else {
                        // TODO: shake, give indication
                        userNotice('Not enough letters');
                    }
                    break;
                default:
                    row.updateCell(letter);
                    row.getNextCell();
                    break;
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        console.log(event.key)
    });
    // TODO: set up listeners for keyboard keys

  }, false);