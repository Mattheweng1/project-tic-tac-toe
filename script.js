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
    let playerOneScore = 0;
    let opponentScore = 0;
    let winner = '';
    const gameBoardArr = [];

    for (let i = 0; i < 9; i++) {
        gameBoardArr.push({mark: ''});
    }

    setTimeout(() => gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore));

    const markBoard = (index) => {
        if (winner === '') {
            if (gameBoardArr[index].mark === '') {
                if (playerOneTurn) {
                    gameBoardArr[index].mark = 'x';
                    gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                    evaluateTurn();
                } else {
                    gameBoardArr[index].mark = 'o';
                    gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                    evaluateTurn();
                }
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

    const resetGame = () => {
        playerOneTurn = true;
        winner = '';

        gameBoardArr.forEach((obj) => {
            obj.mark = '';
            gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
        })
    }

    const setNewGame = () => {
        playerOneScore = 0;
        opponentScore = 0;

        resetGame();
    }
    
    const evaluateTurn = () => {
        switch (true) {
            case (checkWin('x')):
                playerOneScore++;
                winner = 'p1';
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                break;
            case  (checkWin('o')):
                opponentScore++;
                winner = 'p2'
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                break;
            case (checkFullBoard()):
                winner = 'tie';
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                break;
            default:
                playerOneTurn = !playerOneTurn;
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
        }
    }



    return {
        // public methods

        markBoard, resetGame, setNewGame
    };
})();

const gameDisplay = (() => {
    // variables and methods...

    document.getElementById('newGame').addEventListener('click', () => game.setNewGame());
    document.getElementById('gameRematch').addEventListener('click', () => game.resetGame());
    Array.from(document.getElementById('gameBoard').children).forEach((cell) => {
        cell.addEventListener('click', () => game.markBoard(cell.getAttribute('data-index')));
    })

    const updateGameDisplay = (gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore) => {
        updateGameBoard(gameBoardArr);
        updateGameMessage(playerOneTurn, winner);
        updateGameScore(playerOneScore, opponentScore);
    }

    const updateGameBoard = (gameBoardArr) => {
        for (let i = 0; i < 9; i++) {
            document.getElementById('gameBoard').children[i].setAttribute('data-index', i);
            document.getElementById('gameBoard').children[i].textContent = gameBoardArr[i].mark;
        }
    }

    const updateGameMessage = (playerOneTurn, winner) => {
        if (winner === '') {
            if (playerOneTurn) {
                document.getElementById('gameMessage').textContent = `Player 1's turn.`;
            } else {
                document.getElementById('gameMessage').textContent = `Player 2's turn.`;
            }
        } else if (winner === 'p1') {
            document.getElementById('gameMessage').textContent = `Player 1 wins!`;
        } else if (winner === 'p2') {
            document.getElementById('gameMessage').textContent = `Player 2 wins!`;
        } else if (winner === 'tie') {
            document.getElementById('gameMessage').textContent = `It's a tie!`;
        }
    }

    const updateGameScore = (playerOneScore, opponentScore) => {
        document.querySelector('.playerOneScore').textContent = playerOneScore;
        document.querySelector('.opponentScore').textContent = opponentScore;
    }

    const radioPlayerTwo = document.querySelector('input#playerTwo');
    const radioMrGuesser = document.querySelector('input#mrGuesser');
    const radioMrUnbeatable = document.querySelector('input#mrUnbeatable');
    const playerTwoName = document.querySelector(`label[for='playerTwoName']`);
    const aiOpponentName = document.querySelector(`#aiOpponentName`);
    const radioOpponents = document.querySelectorAll(`input[name='opponent']`);

    const updateOpponent = () => {
        console.log(radioPlayerTwo.checked);
        if (radioPlayerTwo.checked) {
            playerTwoName.style.display = 'grid';
            aiOpponentName.style.display = 'none';
        } else {
            aiOpponentName.style.display = 'grid';
            playerTwoName.style.display = 'none';

            if (radioMrGuesser.checked) {
                aiOpponentName.textContent = 'Mr. Guesser';
            } else if (radioMrUnbeatable.checked) {
                aiOpponentName.textContent = 'Mr. Unbeatable';
            }
        }
    }

    for (const radioOpponent of radioOpponents) {
        radioOpponent.addEventListener('change', updateOpponent);
    }

    return {
        // public methods

        updateGameDisplay
    };
})();

const Player = (name) => {

    const setName = (name) => this.name = name;

    console.log(this);

    return {
        // public methods
        
        setName
    };
};

const playerOne = Player('p1');
playerOne.setName('Player 1');
console.log(playerOne.name);

const playerTwo = Player('p2');
playerTwo.setName('Player 2');
console.log(playerTwo);