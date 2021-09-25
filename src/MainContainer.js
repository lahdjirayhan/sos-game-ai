import './MainContainer.css'
import GameContainer from './GameContainer'
import ControlContainer from './ControlContainer'
import React from 'react';

function countSOS(squares, loc) {
    /* Given that squares[loc] is already not null (filled), count how many SOS are made. 
       Follows the implementation I previously use in Python project sos-game-ai, 
       with several (probably minor) modifications. */
    if (squares[loc] === null) {
        return 0;
    }
    
    const boardLength = Math.sqrt(squares.length);
    const locRow = Math.floor(loc/boardLength);
    const locCol = loc % boardLength;
    const indexesToCheckForSOS = [];

    const stepE = 1;
    const stepW = -1;
    const stepN = -boardLength;
    const stepS = boardLength;

    const stepNE = stepE + stepN;
    const stepNW = stepW + stepN;
    const stepSE = stepE + stepS;
    const stepSW = stepW + stepS;
    if (squares[loc] === "S") {
        const checkEast = locCol < boardLength - 2;
        const checkWest = locCol > 1;
        const checkNorth = locRow > 1;
        const checkSouth = locRow < boardLength - 2;
        
        function expand(loc, dir) {
            return [loc, loc + dir, loc + 2*dir];
        }

        if (checkEast) {
            indexesToCheckForSOS.push(expand(loc, stepE));
            if (checkNorth) {
                indexesToCheckForSOS.push(expand(loc, stepNE));
            }
            if (checkSouth) {
                indexesToCheckForSOS.push(expand(loc, stepSE));
            }
        }

        if (checkWest) {
            indexesToCheckForSOS.push(expand(loc, stepW));
            if (checkNorth) {
                indexesToCheckForSOS.push(expand(loc, stepNW));
            }
            if (checkSouth) {
                indexesToCheckForSOS.push(expand(loc, stepSW));
            }
        }

        if(checkNorth) {
            indexesToCheckForSOS.push(expand(loc, stepN));
        }

        if(checkSouth) {
            indexesToCheckForSOS.push(expand(loc, stepS));
        }
    
    } else if (squares[loc] === "O") {
        const checkH = 0 < locCol < boardLength - 1;
        const checkV = 0 < locRow < boardLength - 1;
        
        const stepH = 1;
        const stepV = boardLength;

        function expand(loc, dir) {
            return [loc - dir, loc, loc + dir];
        }

        if (checkH) {
            indexesToCheckForSOS.push(expand(loc, stepH));
            if (checkV) {
                indexesToCheckForSOS.push(expand(loc, stepH + stepV));
                indexesToCheckForSOS.push(expand(loc, -stepH + stepV));
            }
        }

        if (checkV) {
            indexesToCheckForSOS.push(expand(loc, stepV));
        }

    } else {
        console.log("The given squares[loc] does not contain either S or O. Check.");
        return;
    }

    let numberOfSOSCreated = 0;
    indexesToCheckForSOS.forEach(indexes => {
        /* Get squares multiple indexes, https://stackoverflow.com/a/67835428/11316205 */
        let potentialSOS = indexes.map(i => squares[i]);

        if (potentialSOS.join('') === "SOS") {
            numberOfSOSCreated++;
        }
    })

    return numberOfSOSCreated;
}

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInProgress: false,
            squares: Array(5 * 5).fill(null),
            selectedMarker: null,

            playerScore: 0,
            enemyScore: 0,
        };
    }
    
    handleClick(i) {
        if (!this.state.gameInProgress || this.state.selectedMarker === null) {
            return;
        }

        const squares = this.state.squares;
        if (squares[i] !== null){
            return
        }

        squares[i] = this.state.selectedMarker;
        const numberOfSOSCreated = countSOS(squares, i);
        const playerScore = this.state.playerScore + numberOfSOSCreated;
        this.setState({
            squares: squares,
            selectedMarker: null,
            playerScore: playerScore,
        });
    }

    handleClickOnS() {
        if (!this.state.gameInProgress) {
            return;
        }
        this.setState({
            selectedMarker: "S",
        })
    }

    handleClickOnO() {
        if (!this.state.gameInProgress) {
            return;
        }
        this.setState({
            selectedMarker: "O",
        })
    }

    startGame() {
        this.setState({
            gameInProgress: true,
            selectedMarker: null,
            playerScore: 0,
            enemyScore: 0,
        });
    }

    endGame() {
        this.setState({
            gameInProgress: false,
            squares: Array(5 * 5).fill(null),
            selectedMarker: null,
        });
    }

    render() {
        return (
            <div className='main'>
                <p> This is main container. </p>
                <GameContainer
                    gameInProgress={this.state.gameInProgress}
                    squares={this.state.squares}
                    selectedMarker={this.state.selectedMarker}
                    playerScore={this.state.playerScore}
                    enemyScore={this.state.enemyScore}

                    handleClick={(i) => this.handleClick(i)}
                    handleClickOnS={() => this.handleClickOnS()}
                    handleClickOnO={() => this.handleClickOnO()}
                />
                <ControlContainer
                    gameInProgress={this.state.gameInProgress}

                    startGame={() => this.startGame()}
                    stopGame={() => this.endGame()}
                />
            </div>
        );
    }
}

export default MainContainer;