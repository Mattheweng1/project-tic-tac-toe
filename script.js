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
                    setTimeout(() => {
                        document.getElementById('gameBoard').children[index].querySelector('.xSVG').classList.add('drawn');
                    });
                    evaluateTurn();
                    gameDisplay.popText('#gameMessage');
                } else {
                    gameBoardArr[index].mark = 'o';
                    gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                    setTimeout(() => {
                        document.getElementById('gameBoard').children[index].querySelector('.oSVG').classList.add('drawn');
                    });
                    evaluateTurn();
                    gameDisplay.popText('#gameMessage');
                }
            }
        }
    }

    const checkWin = (mark) => {
        let result = false;
        
        if ([gameBoardArr[0], gameBoardArr[4], gameBoardArr[8]].every((obj) => obj.mark === mark)) {
            document.getElementById('0to8strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[2], gameBoardArr[4], gameBoardArr[6]].every((obj) => obj.mark === mark)) {
            document.getElementById('2to6strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[0], gameBoardArr[1], gameBoardArr[2]].every((obj) => obj.mark === mark)) {
            document.getElementById('0to2strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[3], gameBoardArr[4], gameBoardArr[5]].every((obj) => obj.mark === mark)) {
            document.getElementById('3to5strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[6], gameBoardArr[7], gameBoardArr[8]].every((obj) => obj.mark === mark)) {
            document.getElementById('6to8strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[0], gameBoardArr[3], gameBoardArr[6]].every((obj) => obj.mark === mark)) {
            document.getElementById('0to6strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[1], gameBoardArr[4], gameBoardArr[7]].every((obj) => obj.mark === mark)) {
            document.getElementById('1to7strikeSVG').classList.add('drawn');
            result = true;
        }
            
        if ([gameBoardArr[2], gameBoardArr[5], gameBoardArr[8]].every((obj) => obj.mark === mark)) {
            document.getElementById('2to8strikeSVG').classList.add('drawn');
            result = true;
        }
            
        return result;
    }

    const checkFullBoard = () => {
        if (gameBoardArr.every((obj) => obj.mark !== '')) {
            document.getElementById('tieStrikeSVG').classList.add('drawn');
            return true;
        }
    }

    const resetGame = () => {
        playerOneTurn = true;
        winner = '';

        gameBoardArr.forEach((obj) => {
            obj.mark = '';
            gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
        })

        gameDisplay.popText('#gameMessage');
        Array.from(document.querySelectorAll('.strikeSVG')).forEach((svg) => {
            svg.classList.remove('drawn');
        })
    }

    const setNewGame = () => {
        playerOneScore = 0;
        opponentScore = 0;

        resetGame();

        gameDisplay.popText('.playerOneScore');
        gameDisplay.popText('.opponentScore');
    }
    
    const evaluateTurn = () => {
        switch (true) {
            case (checkWin('x')):
                playerOneScore++;
                winner = 'p1';
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                gameDisplay.popText('.playerOneScore');
                break;
            case  (checkWin('o')):
                opponentScore++;
                winner = 'p2'
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                gameDisplay.popText('.opponentScore');
                break;
            case (checkFullBoard()):
                winner = 'tie';
                gameDisplay.updateGameDisplay(gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore);
                gameDisplay.popText('.playerOneScore');
                gameDisplay.popText('.opponentScore');
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

    document.getElementById('gameRematch').addEventListener('click', () => game.resetGame());

    const updateGameDisplay = (gameBoardArr, playerOneTurn, winner, playerOneScore, opponentScore) => {
        updateGameBoard(gameBoardArr);
        updateGameMessage(playerOneTurn, winner);
        updateGameScore(playerOneScore, opponentScore);
    }

    const updateGameBoard = (gameBoardArr) => {
        for (let i = 0; i < 9; i++) {
            document.getElementById('gameBoard').children[i].setAttribute('data-index', i);
            document.getElementById('gameBoard').children[i].addEventListener('click', () => game.markBoard(i));

            const xSVGhtml = `<svg class="xSVG" width="100%" height="100%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <g stroke="null" id="svg_16">
                            <path stroke="#c2410c" d="m164,168.2896c10.47534,9.66516 27.80036,21.48288 54.99552,48.32579c27.9348,27.57299 47.00964,53.25677 77.25561,86.98642c26.07713,29.08068 58.92377,57.99095 95.58744,84.57013l30.11659,16.91403l23.56951,6.04072l10.47534,0" id="svg_9" fill-opacity="0" stroke-width="40" fill="none"/>
                            <path stroke="#c2410c" d="m165.30942,421.99999c1.30942,-1.20814 8.82576,-9.95517 20.95067,-21.74661c21.66722,-21.0713 55.98643,-46.19399 86.42152,-74.90497c29.80892,-28.1203 62.85202,-68.86425 90.34978,-105.10859l18.33184,-26.57918l18.33184,-27.78733l6.54709,-10.8733" id="svg_15" fill-opacity="0" stroke-width="40" fill="none"/>
                        </g>
                    </g>
                </svg>`;

            const oSVGhtml = `<svg class="oSVG" width="100%" height="100%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path stroke="#c2410c" fill-opacity="0" stroke-width="40" d="m298.01103,165.50389c-9.04095,0 -22.93433,-3.01461 -49.72522,3.28062c-23.72574,5.57499 -45.11731,15.68454 -65.86977,34.4465c-18.65972,16.86995 -31.58917,36.2881 -38.10114,59.05115c-7.65504,26.75873 -7.25125,52.14125 2.58313,80.37517c11.24604,32.28674 26.63039,57.36771 57.4746,78.73486c29.79474,20.64013 66.43254,26.16972 105.26248,28.70542c32.89776,2.1483 68.59292,-3.33408 88.47214,-19.68372c21.93121,-18.0373 36.32784,-47.61874 41.33005,-74.63409c5.66589,-30.59982 5.4491,-67.12352 -1.29156,-95.95812c-7.33812,-31.39038 -22.99487,-61.94558 -47.14209,-82.01548c-22.23342,-18.47926 -52.95413,-26.24495 -84.59745,-31.16588l-32.93488,-1.64031l-8.39517,0" id="svg_15" fill="#000000"/>
                    </g>
                </svg>`;

            if (document.getElementById('gameBoard').children[i].innerHTML === '') {
                if (gameBoardArr[i].mark === 'x') {
                document.getElementById('gameBoard').children[i].innerHTML = xSVGhtml;
                } else if (gameBoardArr[i].mark === 'o') {
                    document.getElementById('gameBoard').children[i].innerHTML = oSVGhtml;
                }
            } else if (gameBoardArr[i].mark === '') {
                document.getElementById('gameBoard').children[i].innerHTML = '';
            }
        }
    }

    const updateGameMessage = (playerOneTurn, winner) => {
        if (winner === '') {
            if (playerOneTurn) {
                document.getElementById('gameMessage').textContent = `${players.playerOne.getName()}'s turn.`;
            } else {
                document.getElementById('gameMessage').textContent = `${opponentScoreBoardName.textContent}'s turn.`;
            }
        } else if (winner === 'p1') {
            document.getElementById('gameMessage').textContent = `${players.playerOne.getName()} WINS!`;
        } else if (winner === 'p2') {
            document.getElementById('gameMessage').textContent = `${opponentScoreBoardName.textContent} WINS!`;
        } else if (winner === 'tie') {
            document.getElementById('gameMessage').textContent = `It's a TIE!`;
        }
    }

    const updateGameScore = (playerOneScore, opponentScore) => {
        document.querySelector('.playerOneScore').textContent = playerOneScore;
        document.querySelector('.opponentScore').textContent = opponentScore;
    }

    const popText = (querySelector) => {
        document.querySelector(querySelector).classList.add('scaled');
        setTimeout(() => {
            document.querySelector(querySelector).classList.remove('scaled');
        }, 400);
    }

    const radioPlayerTwo = document.querySelector('input#playerTwo');
    const radioMrGuesser = document.querySelector('input#mrGuesser');
    const radioMrUnbeatable = document.querySelector('input#mrUnbeatable');
    const playerTwoName = document.querySelector(`label[for='playerTwoName']`);
    const aiOpponentName = document.querySelector(`#aiOpponentName`);
    const radioOpponents = document.querySelectorAll(`input[name='opponent']`);

    const updateOpponent = () => {
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

    const playerOneNameField = document.getElementById('playerOneName');
    const playerTwoNameField = document.getElementById('playerTwoName');
    const playerOneScoreBoardName = document.querySelector('.playerOne');
    const opponentScoreBoardName = document.querySelector('.opponent');

    const updatePlayerNames = () => {
        players.playerOne.setName(playerOneNameField.value ? playerOneNameField.value : 'Player 1');
        players.playerTwo.setName(playerTwoNameField.value ? playerTwoNameField.value : 'Player 2');

        playerOneScoreBoardName.textContent = players.playerOne.getName();
        
        if (radioPlayerTwo.checked) {
            opponentScoreBoardName.textContent = players.playerTwo.getName();
        } else if (radioMrGuesser.checked) {
            opponentScoreBoardName.textContent = players.mrGuesser.getName();
        } else if (radioMrUnbeatable.checked) {
            opponentScoreBoardName.textContent = players.mrUnbeatable.getName();
        }
    };

    document.getElementById('newGame').addEventListener('click', () => {
        updatePlayerNames();
        game.setNewGame();
    });

    return {
        // public methods

        updateGameDisplay,
        popText
    };
})();

const players = (() => {

    const player = (playerName) => {
        return {
            getName() {
                return playerName;
            },
            setName(newName) {
                playerName = newName;
            }
        }
    };

    const playerOne = player('Player 1');

    const playerTwo = player('Player 2');

    const mrGuesser = Object.assign({}, player('Mr. Guesser'));

    const mrUnbeatable = Object.assign({}, player('Mr. Unbeatable'));
    
    return {
        playerOne,
        playerTwo,
        mrGuesser,
        mrUnbeatable
    };
})();