//events - a super-basic Javascript (publish subscribe) pattern

var events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};

// Game Module

const game = (() => {
    // variables and methods...

    let playerOneTurn = true;

    const gameBoardArr = [];

    for (let i = 0; i < 9; i++) {
        gameBoardArr.push({mark: ''});
    }

    /* setTimeout(() => events.emit('updateDisplay', gameBoardArr)); */
    setTimeout(() => gameDisplay.updateDisplay(gameBoardArr));

    const markBoard = (index) => {
        if (gameBoardArr[index].mark === '') {
            if (playerOneTurn) {
                gameBoardArr[index].mark = 'x';
                /* events.emit('updateDisplay', gameBoardArr); */
                gameDisplay.updateDisplay(gameBoardArr);
                setTimeout(() => evaluateTurn());
                /* evaluateTurn(); */
            } else {
                gameBoardArr[index].mark = 'o';
                /* events.emit('updateDisplay', gameBoardArr); */
                gameDisplay.updateDisplay(gameBoardArr);
                setTimeout(() => evaluateTurn());
                /* evaluateTurn(); */
            }
            
        }
        
    }

    const checkWin = (mark) => {
        switch (true) {
            case ([gameBoardArr[0], gameBoardArr[3], gameBoardArr[6]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[1], gameBoardArr[4], gameBoardArr[7]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[2], gameBoardArr[5], gameBoardArr[8]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[0], gameBoardArr[1], gameBoardArr[2]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[3], gameBoardArr[4], gameBoardArr[5]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[6], gameBoardArr[7], gameBoardArr[8]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[0], gameBoardArr[4], gameBoardArr[8]].every((obj) => obj.mark === mark)):
                return true;
                break;
            case ([gameBoardArr[2], gameBoardArr[4], gameBoardArr[6]].every((obj) => obj.mark === mark)):
                return true;
                break;
            default:
                return false;
        }
    }

    const checkFullBoard = () => {
        return gameBoardArr.every((obj) => obj.mark !== '');
    }

    const clearBoard = () => {
        playerOneTurn = true;

        gameBoardArr.forEach((obj) => {
            obj.mark = '';
            /* events.emit('updateDisplay', gameBoardArr); */
            gameDisplay.updateDisplay(gameBoardArr);
        })
    }
    
    const evaluateTurn = () => {
        switch (true) {
            case (checkWin('x')):
                alert('Player 1 wins!');
                clearBoard();
                break;
            case  (checkWin('o')):
                alert('Player 2 wins!');
                clearBoard();
                break;
            case (checkFullBoard()):
                alert(`It's a tie!`);
                clearBoard();
                break;
            default:
                playerOneTurn = !playerOneTurn;
        }
    }



    return {
        // public methods

        markBoard
    };
})();

const gameDisplay = (() => {
    // variables and methods...

    /* console.log(document.getElementById('gameBoard').children[0]); */

    /* events.on('updateDisplay', (gameBoardArr) => updateDisplay(gameBoardArr)); */
    Array.from(document.getElementById('gameBoard').children).forEach((cell) => {
        cell.addEventListener('click', () => game.markBoard(cell.getAttribute('data-index')));
    })

    const updateDisplay = (gameBoardArr) => {
        for (let i = 0; i < 9; i++) {
            document.getElementById('gameBoard').children[i].setAttribute('data-index', i);
            document.getElementById('gameBoard').children[i].textContent = gameBoardArr[i].mark;
        }
    }

    return {
        // public methods

        updateDisplay
    };
})();

const Player = () => {

    const setName = (name) => this.name = name;

    return {
        // public methods
        
        setName
    };
};

const playerOne = Player();
playerOne.setName('Player 1');

const playerTwo = Player();
playerTwo.setName('Player 2');