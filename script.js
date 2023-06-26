// Game Module

const game = (() => {
    // variables and methods...

    const gameData = {};

    gameData.playerOneTurn = true;
    gameData.playerOneStarts = true;
    setTimeout(() => {
        gameData.opponent = players.playerTwo;
    });
    gameData.playerOneScore = 0;
    gameData.opponentScore = 0;
    gameData.winner = '';
    gameData.gameBoardArr = [];

    for (let i = 0; i < 9; i++) {
        gameData.gameBoardArr.push('');
    }

    setTimeout(() => gameDisplay.updateGameDisplay(gameData));

    const markBoard = (index) => {
        if (gameData.winner === '') {
            if (gameData.gameBoardArr[index] === '') {
                if (gameData.playerOneTurn) {
                    gameData.gameBoardArr[index] = 'x';
                    gameDisplay.updateGameDisplay(gameData);
                    setTimeout(() => {
                        document.getElementById('gameBoard').children[index].querySelector('.xSVG').classList.add('drawn');
                    });
                    gameData.evaluateTurn();
                    gameDisplay.popText('#gameMessage');

                    if (gameData.opponent === players.mrGuesser) {
                        players.mrGuesser.playMove(gameData);
                    } else if (gameData.opponent === players.mrUnbeatable) {
                        players.mrUnbeatable.playMove(gameData);
                    }
                } else {
                    gameData.gameBoardArr[index] = 'o';
                    gameDisplay.updateGameDisplay(gameData);
                    setTimeout(() => {
                        document.getElementById('gameBoard').children[index].querySelector('.oSVG').classList.add('drawn');
                    });
                    gameData.evaluateTurn();
                    gameDisplay.popText('#gameMessage');
                }
            }
        }
    }

    gameData.checkWin = (gameState, mark, toDraw) => {
        let result = false;
        
        if ([gameState[0], gameState[4], gameState[8]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('0to8strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[2], gameState[4], gameState[6]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('2to6strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[0], gameState[1], gameState[2]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('0to2strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[3], gameState[4], gameState[5]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('3to5strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[6], gameState[7], gameState[8]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('6to8strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[0], gameState[3], gameState[6]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('0to6strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[1], gameState[4], gameState[7]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('1to7strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        if ([gameState[2], gameState[5], gameState[8]].every((cell) => cell === mark)) {
            if (toDraw) {
                document.getElementById('2to8strikeSVG').classList.add('drawn');
            }
            result = true;
        }
            
        return result;
    }

    gameData.checkFullBoard = (gameState, toDraw) => {
        if (gameState.every((cell) => cell !== '')) {
            if (toDraw) {
                document.getElementById('tieStrikeSVG').classList.add('drawn');
            }
            return true;
        }
    }

    const resetGame = (playerOneStarts) => {
        gameData.playerOneStarts = playerOneStarts;

        gameData.winner = '';

        Array.from(document.querySelectorAll('.strikeSVG')).forEach((svg) => {
            svg.classList.remove('drawn');
        });

        for (let i = 0; i < 9; i++) {
            gameData.gameBoardArr[i] = '';
        }

        if (playerOneStarts) {
            gameData.playerOneTurn = true;

            gameDisplay.updateGameDisplay(gameData);
            gameDisplay.popText('#gameMessage');
        } else {
            gameData.playerOneTurn = false;

            gameDisplay.updateGameDisplay(gameData);
            gameDisplay.popText('#gameMessage');

            if (gameData.opponent === players.mrGuesser) {
                players.mrGuesser.playMove(gameData);
            } else if (gameData.opponent === players.mrUnbeatable) {
                // mrUnbeatable would play randomly for the first move anyway, so mrGuesser's method is like a shortcut.
                players.mrGuesser.playMove(gameData);
            }
        }
    }

    const setNewGame = () => {
        gameData.playerOneScore = 0;
        gameData.opponentScore = 0;

        resetGame(true);

        gameDisplay.updateOpponent(gameData);

        gameDisplay.popText('.playerOneScore');
        gameDisplay.popText('.opponentScore');
    }
    
    gameData.evaluateTurn = () => {
        switch (true) {
            case (gameData.checkWin(gameData.gameBoardArr, 'x', true)):
                gameData.playerOneScore++;
                gameData.winner = 'p1';
                gameDisplay.updateGameDisplay(gameData);
                gameDisplay.popText('.playerOneScore');
                break;
            case  (gameData.checkWin(gameData.gameBoardArr, 'o', true)):
                gameData.opponentScore++;
                gameData.winner = 'p2'
                gameDisplay.updateGameDisplay(gameData);
                gameDisplay.popText('.opponentScore');
                break;
            case (gameData.checkFullBoard(gameData.gameBoardArr, true)):
                gameData.winner = 'tie';
                gameDisplay.updateGameDisplay(gameData);
                gameDisplay.popText('.playerOneScore');
                gameDisplay.popText('.opponentScore');
                break;
            default:
                gameData.playerOneTurn = !gameData.playerOneTurn;
                gameDisplay.updateGameDisplay(gameData);
        }
    }



    return {
        // public methods

        markBoard, resetGame, setNewGame,
    };
})();

const gameDisplay = (() => {
    // variables and methods...

    document.getElementById('playerOneStarts').addEventListener('click', () => {
        game.resetGame(true);
    });
    document.getElementById('opponentStarts').addEventListener('click', () => {
        game.resetGame(false);
    });

    const updateGameDisplay = (gameData) => {
        updateGameBoard(gameData);
        updateGameMessage(gameData);
        updateGameScore(gameData);
    }

    const updateGameBoard = (gameData) => {
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

        for (let i = 0; i < 9; i++) {
            document.getElementById('gameBoard').children[i].setAttribute('data-index', i);
            document.getElementById('gameBoard').children[i].addEventListener('click', () => game.markBoard(i));

            if (document.getElementById('gameBoard').children[i].innerHTML === '') {
                if (gameData.gameBoardArr[i] === 'x') {
                    document.getElementById('gameBoard').children[i].innerHTML = xSVGhtml;
                } else if (gameData.gameBoardArr[i] === 'o') {
                    document.getElementById('gameBoard').children[i].innerHTML = oSVGhtml;
                }
            } else if (gameData.gameBoardArr[i] === '') {
                document.getElementById('gameBoard').children[i].innerHTML = '';
            }
        }
    }

    const updateGameMessage = (gameData) => {
        if (gameData.winner === '') {
            if (gameData.playerOneTurn) {
                document.getElementById('gameMessage').textContent = `${players.playerOne.getName()}'s turn.`;
            } else {
                document.getElementById('gameMessage').textContent = `${opponentScoreBoardName.textContent}'s turn.`;
            }
        } else if (gameData.winner === 'p1') {
            document.getElementById('gameMessage').textContent = `${players.playerOne.getName()} WINS!`;
        } else if (gameData.winner === 'p2') {
            document.getElementById('gameMessage').textContent = `${opponentScoreBoardName.textContent} WINS!`;
        } else if (gameData.winner === 'tie') {
            document.getElementById('gameMessage').textContent = `It's a TIE!`;
        }
    }

    const updateGameScore = (gameData) => {
        document.querySelector('.playerOneScore').textContent = gameData.playerOneScore;
        document.querySelector('.opponentScore').textContent = gameData.opponentScore;
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

    const updateCheckedOpponent = () => {
        if (radioPlayerTwo.checked) {
            playerTwoName.style.display = 'grid';
            aiOpponentName.style.display = 'none';
        } else {
            aiOpponentName.style.display = 'grid';
            playerTwoName.style.display = 'none';

            if (radioMrGuesser.checked) {
                aiOpponentName.textContent = players.mrGuesser.getName();
            } else if (radioMrUnbeatable.checked) {
                aiOpponentName.textContent = players.mrUnbeatable.getName();
            }
        }
    };

    for (const radioOpponent of radioOpponents) {
        radioOpponent.addEventListener('change', updateCheckedOpponent);
    }

    const updateOpponent = (gameData) => {
        switch (true) {
            case (radioPlayerTwo.checked):
                gameData.opponent = players.playerTwo;
                break;
            case (radioMrGuesser.checked):
                gameData.opponent = players.mrGuesser;
                break;
            case (radioMrUnbeatable.checked):
                gameData.opponent = players.mrUnbeatable;
                break;
        }
    };

    const playerOneNameField = document.getElementById('playerOneName');
    const playerTwoNameField = document.getElementById('playerTwoName');
    const playerOneScoreBoardName = document.querySelector('.playerOne');
    const opponentScoreBoardName = document.querySelector('.opponent');
    const playerOneStartsBtn = document.querySelector('#playerOneStarts');
    const opponentStartsBtn = document.querySelector('#opponentStarts');

    const updatePlayerNames = () => {
        players.playerOne.setName(playerOneNameField.value ? playerOneNameField.value : 'Player 1');
        players.playerTwo.setName(playerTwoNameField.value ? playerTwoNameField.value : 'Player 2');

        playerOneScoreBoardName.textContent = players.playerOne.getName();
        playerOneStartsBtn.textContent = players.playerOne.getName() + ' Starts';
        
        if (radioPlayerTwo.checked) {
            opponentScoreBoardName.textContent = players.playerTwo.getName();
            opponentStartsBtn.textContent = players.playerTwo.getName() + ' Starts';
        } else if (radioMrGuesser.checked) {
            opponentScoreBoardName.textContent = players.mrGuesser.getName();
            opponentStartsBtn.textContent = players.mrGuesser.getName() + ' Starts';
        } else if (radioMrUnbeatable.checked) {
            opponentScoreBoardName.textContent = players.mrUnbeatable.getName();
            opponentStartsBtn.textContent = players.mrUnbeatable.getName() + ' Starts';
        }
    };

    document.getElementById('newGame').addEventListener('click', () => {
        updatePlayerNames();
        game.setNewGame();
    });

    return {
        // public methods

        updateGameDisplay,
        updateOpponent,
        popText
    };
})();

const players = (() => {

    const player = (playerName) => {
        const getName = () => {
            return playerName;
        };

        const setName = (newName) => {
            playerName = newName;
        };

        return {
            getName,
            setName
        }
    };

    const guesser = () => {
        const playMove = (gameData) => {
            if (gameData.winner === '') {
                const possibleMoves = [];

                for (let i = 0; i < 9; i++) {
                    if (gameData.gameBoardArr[i] === '') {
                        possibleMoves.push(i);
                    }
                }

                const randomMoveIndex = (() => {
                    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                })();
                
                gameData.gameBoardArr[randomMoveIndex] = 'o';
                gameDisplay.updateGameDisplay(gameData);
                setTimeout(() => {
                    document.getElementById('gameBoard').children[randomMoveIndex].querySelector('.oSVG').classList.add('drawn');
                }, 100);
                gameData.evaluateTurn();
                gameDisplay.popText('#gameMessage');
            }
        }

        return {
            playMove
        }
    };

    const unbeatable = () => {
        const terminal = (gameData, gameState) => {
            switch (true) {
                case (gameData.checkWin(gameState, 'x', false)):
                    return true;
                    break;
                case  (gameData.checkWin(gameState, 'o', false)):
                    return true;
                    break;
                case (gameData.checkFullBoard(gameState, false)):
                    return true;
                    break;
                default:
                    return false;
            }
        };

        const terminalValue = (gameData, gameState) => {
            switch (true) {
                case (gameData.checkWin(gameState, 'x', false)):
                    return -1;
                    break;
                case (gameData.checkWin(gameState, 'o', false)):
                    return 1;
                    break;
                case (gameData.checkFullBoard(gameState, false)):
                    return 0;
                    break;
            }
        };

        const turn = (gameData, gameState) => {
            let xCounter = 0;
            let oCounter = 0;

            gameState.forEach((cell) => {
                if (cell === 'x') {
                    xCounter++;
                } else if (cell === 'o') {
                    oCounter++;
                }
            })

            // 'o' player is the maximizing player.

            if (gameData.playerOneStarts) {
                if (xCounter > oCounter) {
                    return 'max';
                } else {
                    return 'min';
                }
            } else {
                if (oCounter > xCounter) {
                    return 'min';
                } else {
                    return 'max';
                }
            }

            
        };

        const possibleMoves = (gameState) => {
            const moves = [];

            for (let i = 0; i < 9; i++) {
                if (gameState[i] === '') {
                    moves.push(i);
                }
            }
            return moves;
        };

        const result = (gameData, gameState, move) => {
            const newGameState = [...gameState];

            if (turn(gameData, gameState) === 'max') {
                newGameState[move] = 'o';
            } else {
                newGameState[move] = 'x';
            }
            return newGameState;
        };

        const minimax = (gameData, gameState) => {
            if (terminal(gameData, gameState)) {
                return terminalValue(gameData, gameState);
            } else {
                if (turn(gameData, gameState) === 'max') {
                    let maxValue = -Infinity;
                    possibleMoves(gameState).forEach((move) => {
                        maxValue = Math.max(maxValue, minimax(gameData, [...result(gameData, gameState, move)]));
                    });
                    return maxValue;
                } else if (turn(gameData, gameState) === 'min') {
                    let minValue = Infinity;
                    possibleMoves(gameState).forEach((move) => {
                        minValue = Math.min(minValue, minimax(gameData, [...result(gameData, gameState, move)]));
                    });
                    return minValue;
                }
            }
        };

        const playMove = (gameData) => {
            if (gameData.winner === '') {
                const gameState = [...gameData.gameBoardArr];

                const moveValueArr = [];

                possibleMoves(gameState).forEach((move) => {
                    moveValueArr[move] = minimax(gameData, [...result(gameData, gameState, move)]);
                });

                let bestValue = -Infinity;

                moveValueArr.forEach((value) => {
                    if (value > bestValue) {
                        bestValue = value;
                    }
                });

                const bestMoves = [];

                while (moveValueArr.lastIndexOf(bestValue) !== -1) {
                    bestMoves.push(moveValueArr.lastIndexOf(bestValue));
                    moveValueArr.splice(moveValueArr.lastIndexOf(bestValue), 1);
                }

                const randomBestMoveIndex = (() => {
                    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
                })();
                
                gameData.gameBoardArr[randomBestMoveIndex] = 'o';
                gameDisplay.updateGameDisplay(gameData);
                setTimeout(() => {
                    document.getElementById('gameBoard').children[randomBestMoveIndex].querySelector('.oSVG').classList.add('drawn');
                });
                gameData.evaluateTurn();
                gameDisplay.popText('#gameMessage');
            }
        };

        return {
            playMove
        }
    };

    const playerOne = player('Player 1');

    const playerTwo = player('Player 2');

    const mrGuesser = Object.assign({}, player('Mr. Guesser'), guesser());

    const mrUnbeatable = Object.assign({}, player('Mr. Unbeatable'), unbeatable());
    
    return {
        playerOne,
        playerTwo,
        mrGuesser,
        mrUnbeatable
    };
})();