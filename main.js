'use strict';

function getWord() {
    // possible to get the same word twice since we're not keeping
    // track of what's been used previously
    const wordIndex = Math.floor(Math.random() * wordList.length);
    const selectedWord = wordList[wordIndex].toUpperCase();
    console.log(`Word: ${selectedWord} at index[${wordIndex}]`);
    return selectedWord;
}

function Row(rowId) {
    this.rowId;
    this.currentIndex = 1;
    this.maxIndex = 5;
    this.getFirstCell = () => {
        return document.querySelector(`#${rowId} :nth-child(1)`);
    };
    this.getNextCell = () => {
        if (this.currentIndex >= this.maxIndex) {
            return document.querySelector(`#${rowId} :nth-child(5)`);
        }

        this.currentIndex++;
        return document.querySelector(`#${rowId} :nth-child(${this.currentIndex})`);
    };
    this.getPreviousCell = () => {
        if (this.currentIndex <= 1) {
            return document.querySelector(`#${rowId} :nth-child(1)`);
        }

        this.currentIndex--;
        return document.querySelector(`#${rowId} :nth-child(${this.currentIndex})`);
    };
    this.updateCell = (letter) => {
        const currentCell = this.getCurrentCell();
        currentCell.innerText = letter;
    };
    this.getCurrentCell = () => {
        return document.querySelector(`#${rowId} :nth-child(${this.currentIndex})`);
    };
    this.isComplete = () => {
        if (this.currentIndex < 5) {
            return false;
        }

        return this.getCurrentCell().innerText != '';
    };
    this.matches = (matchWord) => {
        const allCells = Array.from(document.querySelectorAll(`#${rowId} div.letter`));
        let userWord = '';
        allCells.forEach(e => {
            userWord += e.innerText;
        });
        return userWord == matchWord;
    };
    this.colorCells = () => {
        // check if letter and position match > .green
        // check if letter is in word > .orange
        // else > .grey
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // get today's word
    const todaysWord = getWord();
    const row = new Row('row2');

    // setup listeners for keys
    const keys = document.querySelectorAll(".key");
    keys.forEach(elem => {
        elem.addEventListener('click', (evt) => {
            const letter = evt.currentTarget.innerText;
            switch (letter) {
                case 'DEL':
                    if (row.getCurrentCell().innerText === "") {
                        row.getPreviousCell();
                    }
                    row.updateCell('');
                    break;
                case 'ENTER':
                    // check current row value
                    if (row.isComplete()) {
                        if (row.matches(todaysWord)) {

                            alert(`Success! Today's word was ${todaysWord}`);
                        }
                        // if is valid word, go to next row
                    } else {
                        // shake, give indication
                    }
                    break;
                default:
                    row.updateCell(letter);
                    row.getNextCell();
                    break;
            }
        });
    });

    
    // press a key
    // set value of current cell to that value
    // progress to next cell
    // on 'DEL' remove current letter in cell and go to previous cell
    // on 'ENTER' check that letters make a word and if it matches todaysWord

  }, false);