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

    const gameBoardArr = [];

    for (let i = 0; i < 9; i++) {
        gameBoardArr.push({mark: ''});
    }

    const markBoard = (index) => {
        if (gameBoardArr[index].mark === '') {
            if (player1Turn) {
                gameBoardArr[index].mark = 'x';
                evaluateTurn();
            } else {
                gameBoardArr[index].mark = 'o';
                evaluateTurn();
            }
            
        }
        
    }

    let player1Turn = true;

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
        gameBoardArr.forEach((obj) => {
            obj.mark = '';
        })
    }
    
    const evaluateTurn = () => {
        console.log(gameBoardArr);

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
            default:
                player1Turn = !player1Turn;
        }
    }



    return {
        // public methods

        markBoard
    };
})();

const displayController = (() => {
    // variables and methods...

    

    return {
        // public methods

    };
})();

const Player = (name) => {

    return {
        // public methods

    };
};