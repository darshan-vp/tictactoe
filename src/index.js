import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {

    let className = "square";
    if (props.winner && props.winner.lines.includes(props.index)) {
        className = "square-red";
    }

    return (
        <button className={className} onClick={props.onClick} >
            {props.value}
        </button>
    );
}

    class Board extends React.Component {

        renderSquare(i) {
            return <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
                index={i}
                winner={this.props.winner}
            />;
        }

        createBoard = () => {
            let board = [];
            let x=0;
            for (let i=0; i<3; i++) {

                let child = [];

                for (let j=0; j<3; j++) {
                    child.push(this.renderSquare(x));
                    x++;
                }

                board.push(<div className="board-row" key={i}>{child}</div>);
            }
            return board;
        }

        render() {
            return (
                <div>
                    {this.createBoard()}
                </div>
            );
        }
    }

        class Game extends React.Component {

            constructor(props) {
                super(props);
                this.state = {
                  history: [{
                    squares: Array(9).fill(null),
                    rowCol: ''
                  }],
                  stepNumber: 0,
                  xIsNext: true,
                };
            }

            jumpTo(step) {
                this.setState({
                  stepNumber: step,
                  xIsNext: (step % 2) === 0,
                });
            }

            calculateRowCol(location) {

                let row1 = [0,1,2];
                let row2 = [3,4,5];
                let col1 = [0,3,6];
                let col2 = [1,4,7];
                let row = '';
                let col = '';

                if (row1.includes(location)) {
                    row = '1';
                }
                else if (row2.includes(location)) {
                    row = '2';
                }
                else {
                    row = '3';
                }

                if (col1.includes(location)) {
                    col = '1';
                }
                else if (col2.includes(location)) {
                    col = '2';
                }
                else {
                    col = '3';
                }

                return '('+row + ',' + col+')';
            }

            handleClick = (i) => {
                console.log('clicked');
                console.log(i);
                console.log(this.state.history, 'stateh');
                console.log(this.state.stepNumber, 'stepnumber');
                const history = this.state.history.slice(0, this.state.stepNumber + 1);
                console.log(history, 'history');
                const current = history[history.length - 1];
                console.log(current, 'current');
                const squares = current.squares.slice();

                if (calculateWinner(squares) || squares[i]) {
                    return;
                }

                squares[i] = this.state.xIsNext ? 'X' : '0';
                console.log(squares, 'squares');

                let rowCol = this.calculateRowCol(i);

                this.setState({
                    history: history.concat([{
                        squares: squares,
                        rowCol: rowCol
                    }]),
                    stepNumber: history.length,
                    xIsNext: !this.state.xIsNext,
                });
                console.log('click completed');
            }

            render() {

                console.log('rendered');

                const history = this.state.history;
                const current = history[this.state.stepNumber];
                const winnerArr = calculateWinner(current.squares);
                console.log(winnerArr, 'winner');
                const winner = (winnerArr) ?  winnerArr.winner : null;

                const moves = history.map((step, move) => {
                    const desc = move ?
                      'Go to move #' + move + ' Location: '+history[move].rowCol:
                      'Go to game start';


                    return (
                        <li key={move}>
                            {(this.state.stepNumber === move) ?
                            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button> :
                            <button onClick={() => this.jumpTo(move)}>{desc}</button>}
                        </li>
                    );

                });


                let status;
                if (winner) {
                    status = 'Winner: '+winner;
                }
                else{
                    status = 'Next player: '+ (this.state.xIsNext ? 'X' : '0');
                }

                if (winner === null && this.state.stepNumber === 9) {
                    status = <b>Game is Drawn</b>;
                }

                console.log('render completed');

                return (
                    <div className="game">
                        <div className="game-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winner={winnerArr} />
                        </div>
                        <div className="game-info">
                            <div>{status}</div>
                            <ol>{moves}</ol>
                        </div>
                    </div>
                );
            }
        }

            // ========================================

            ReactDOM.render(
                <Game />,
                document.getElementById('root')
            );

/**
 * Helper function to decide winner
 * @param {*} squares
 */
function calculateWinner(squares) {

    // Possible winning co-ordinates of board
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let temp = {
        winner: '',
        lines: []
    };

    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            temp.winner = squares[a];
            temp.lines = lines[i];
            return temp;
        }
    }
    return null;
}