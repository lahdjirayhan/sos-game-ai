import React from 'react'
import './GameContainer.css'

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
            size: Math.sqrt(this.props.squares.length),
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
        this.state = {
            squares: Array(5 * 5).fill(null),
        }
    }
    reset() {
        this.setState({
            squares: Array(5 * 5).fill(null),
        });
    }

    handleClick(i) {
        if (!this.props.gameInProgress) {
            return;
        }
        const squares = this.state.squares;
        squares[i] = 'X';
        this.setState({
            squares: squares,
        });
    }

    render() {
        return (
            <Board
                squares={this.state.squares}
                onClick={(i) => this.handleClick(i)}
            />
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
            <div className='game'>
                <Game gameInProgress={this.props.gameInProgress} />

                <p>This is game container.</p>

                <p>{status}</p>
            </div>
        );
    }
}

export default GameContainer;