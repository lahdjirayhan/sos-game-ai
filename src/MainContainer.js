import './MainContainer.css'
import GameContainer from './GameContainer'
import ControlContainer from './ControlContainer'
import React from 'react';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInProgress: false,
            squares: Array(5 * 5).fill(null),
            selectedMarker: null,
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
        this.setState({
            squares: squares,
            selectedMarker: null,
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
                    handleClick={(i) => this.handleClick(i)}
                    handleClickOnS={() => this.handleClickOnS()}
                    handleClickOnO={() => this.handleClickOnO()}
                    selectedMarker={this.state.selectedMarker}
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