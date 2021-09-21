import GameContainer from './GameContainer'
import ControlContainer from './ControlContainer'
import React from 'react';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInProgress: false,
        };
    }

    startGame() {
        this.setState({
            gameInProgress: true,
        });
    }

    endGame() {
        this.setState({
            gameInProgress: false,
        });
    }

    render() {
        return (
            <div className='main'>
                This is main container.
                <GameContainer gameInProgress={this.state.gameInProgress}/>
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