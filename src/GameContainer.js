import React from 'react'
import Button from './Utils'
import './GameContainer.css'
import LineTo from 'react-lineto'

/* Some notes regarding react-lineto:
   The lines made are position-absolute. From what I've tested,
   the lines are anchored to pixel position with regard to browser window.
   The `within` argument can't help much either (or I just don't know
   how to do it properly). Since I'm not very fluent in webdev in general,
   this is a problem I can't solve in present day. */

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
    let className = "square" + " " + props.className;
    return (
        <button className={className} onClick={props.onClick}>
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
                className={"c" + i.toString()}
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
        let linesToRender = [];
        this.props.lines.forEach(json => {
            let [start, end] = json.startEnd;
            start = "c" + start;
            end = "c" + end;
            const color = json.color;
            
            linesToRender.push(
                <LineTo from={start} to={end}
                fromAnchor="center center" toAnchor="center center"
                zIndex={1}
                borderColor={color} borderSize="10px" borderStyle="solid"/>
            )
        })

        return (
            <div className='board'>
                {rows}
                {linesToRender}
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
                    lines={this.props.lines}
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
                    lines={this.props.lines}
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