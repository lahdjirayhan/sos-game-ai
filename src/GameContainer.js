import React from 'react'
import Button from './Utils'
import './GameContainer.css'

function Scoreboard(props) {
    let stringPlayerScore = "Your score: " + props.playerScore.toString()
    let stringEnemyScore = "Enemy score: " + props.enemyScore.toString()
    return (
        <div className='scoreboard'>
            <p>{stringPlayerScore}</p>
            <p>{stringEnemyScore}</p>
        </div>
    )
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: Math.sqrt(props.squares.length),
        }
    }
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(row) {
        let thisRow = [];
        for (let i = row * this.state.size; i < (row + 1) * this.state.size; i++) {
            thisRow.push(this.renderSquare(i))
        }
        return (
            <div className='board-row'>
                {thisRow}
            </div>
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.state.size; i++) {
            rows.push(this.renderRow(i))
        }

        return (
            <div className='board'>
                {rows}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let sButtonClassName = "button-so" + (this.props.selectedMarker === "S" ? " button-so-selected" : "")
        let oButtonClassName = "button-so" + (this.props.selectedMarker === "O" ? " button-so-selected" : "")
        return (
            <div className="game">
                <Board
                    squares={this.props.squares}
                    onClick={(i) => this.props.handleClick(i)}
                />
                <div className="button-so-container">
                    <Button className={sButtonClassName} onClick={() => this.props.handleClickOnS()} text="S"/>
                    <Button className={oButtonClassName} onClick={() => this.props.handleClickOnO()} text="O"/>
                </div>
            </div>
        )
    }
}

class GameContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let status;
        if (this.props.gameInProgress) {
            status = 'There is a game in progress.'
        } else {
            status = 'There is NO game in progress.'
        }
        return (
            <div className='game-container'>
                <Game
                    gameInProgress={this.props.gameInProgress}
                    squares={this.props.squares}
                    handleClick={(i) => this.props.handleClick(i)}
                    handleClickOnS={() => this.props.handleClickOnS()}
                    handleClickOnO={() => this.props.handleClickOnO()}
                    selectedMarker={this.props.selectedMarker}
                />

                <Scoreboard
                    playerScore={this.props.playerScore}
                    enemyScore={this.props.enemyScore}
                />
            </div>
        );
    }
}

export default GameContainer;