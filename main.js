'use strict';

class Puzzle {
    validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ENTER', 'BACKSPACE']

    constructor() {
        this.todaysWord = this.word;
        this.isComplete = false;
        this.rowIndex = 1;
        this.row = new Row();
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll(".key").forEach(elem => {
            elem.addEventListener('click', (evt) => {
                const letter = evt.currentTarget.innerText;
                this.handleKeyEvent(letter);
            });
        });
    
        document.addEventListener('keydown', (event) => {
            const letter = event.key.toUpperCase();
            if (!this.isValidKey(letter)) {
                this.userNotice('Invalid key pressed!');
                return;
            }
    
            this.handleKeyEvent(letter);
        });
    }

    get word() {
        // possible to get the same word twice since we're not keeping
        // track of what's been used previously
        const wordIndex = Math.floor(Math.random() * wordList.length);
        const selectedWord = wordList[wordIndex];
        console.log(`Word: ${selectedWord} at index[${wordIndex}]`);
        return selectedWord;
    }

    get playerStats() {
        const stats = localStorage.getItem('stats');
        if (!stats) {

        }
    }

    userNotice(message) {
        // TODO: work on transition - ease-in/out
        const alertEl = document.querySelector('.alert');
        alertEl.innerText = message;
        alertEl.style.display = "block";
        setTimeout(() => { alertEl.style.display = "none"; }, 3000);
    }

    isValidKey(key) {
        return this.validKeys.find(val => val == key);
    }

    handleKeyEvent(letter) {
        // once complete, ignore keystrokes
        if (this.isComplete) return;

        switch (letter) {
            case 'DEL':
            case 'BACKSPACE':
                if (this.row.getCurrentCell().innerText === "") {
                    this.row.getPreviousCell();
                }
                this.row.updateCell('');
                break;
            case 'ENTER':                
                if (this.row.isComplete()) {
                    if (this.row.matches(this.todaysWord)) {
                        this.row.colorCells(this.todaysWord);
                        this.isComplete = true;
                        switch (this.rowIndex) {
                            case 1:
                                this.userNotice('Genius!')
                                break;
                            case 2:
                                this.userNotice('Magnificent!')
                                break;
                            case 3:
                                this.userNotice('Impressive!')
                                break;
                            case 4:
                                this.userNotice('Splendid!')
                                break;
                            case 5:
                                this.userNotice('Great!')
                                break;
                            default:
                                this.userNotice('Phew!')
                                break;
                        }
                        console.log(`Success! Today's word was ${this.todaysWord}`);
                    } 
                    else if (this.row.isValidWord()) {
                        this.row.colorCells(this.todaysWord);
                        this.rowIndex++;
                        this.row.rowId = `row${this.rowIndex}`;
                        this.row.currentIndex = 1;
                    } else {
                        this.userNotice(`Not a valid word, try again`);
                    }
                } else {
                    // TODO: shake, give indication
                    this.userNotice('Not enough letters');
                }
                break;
            default:
                this.row.updateCell(letter);
                this.row.getNextCell();
                break;
        }
    }
};

class Row {
    constructor() {
        this.rowId = `row1`;
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
            return this.getUserWord() == matchWord;
        };
        this.isValidWord = () => {
            return wordList.includes(this.getUserWord());
        };
        this.colorCells = (matchWord) => {
            // TODO: user words with the same letter more than once will be coloured 
            // incorrectly depending on the order in the matchWord
            const userWord = this.getUserWord().split('');
            const matchWordArr = matchWord;
            userWord.forEach((val, index) => {
                let color = 'grey';
                if (matchWordArr.charAt(index) == val) {
                    color = 'green';
                } else if (matchWordArr.indexOf(val) > 0) {
                    color = 'orange';
                }
                document.querySelector(`#${this.rowId} :nth-child(${index + 1})`).classList.add(color);
                document.querySelector(`.${val}`).classList.add(color)
            });
        };
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const puzzle = new Puzzle();        
}, false);