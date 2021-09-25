import GameContainer from './GameContainer'
import ControlContainer from './ControlContainer'
import React from 'react';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInProgress: false,
            squares: Array(5 * 5).fill(null),
        };
    }
    
    handleClick(i) {
        if (!this.state.gameInProgress) {
            return;
        }
        const squares = this.state.squares;
        squares[i] = 'X';
        this.setState({
            squares: squares,
        });
    }

    startGame() {
        this.setState({
            gameInProgress: true,
        });
    }

    endGame() {
        this.setState({
            gameInProgress: false,
            squares: Array(5 * 5).fill(null),
        });
    }

    render() {
        return (
            <div className='main'>
                This is main container.
                <GameContainer
                    gameInProgress={this.state.gameInProgress}
                    squares={this.state.squares}
                    handleClick={(i) => this.handleClick(i)}
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