import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Square(props) {

    function getBadge(value) {

        let cl;
        cl = (value === 'X') ? "primary" : "secondary";
        return cl;
    }

    // Media Query
    const isActive = useMediaQuery('(min-width:541px)');
    const isActive2 = useMediaQuery('(min-width:235px)');


    return (
        <span>
            <Button
                style={
                    (isActive === true) ? { maxWidth: '100px', maxHeight: '100px', minWidth: '100px', minHeight: '100px', fontSize: '63px' } :
                    (isActive2 === true) ? { maxWidth: '65px', maxHeight: '65px', minWidth: '65px', minHeight: '65px', fontSize: '63px' } : {
                        maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '33px' }
                    }
                variant="outlined"
                color={getBadge(props.value)}
                size="large"
                onClick={props.onClick}
            >
                {props.value}
            </Button>
        </span>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        // const current = history[history.length - 1];
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <Button
                        onClick={() => this.jumpTo(move)}
                        variant="contained"
                        size="medium"
                        style={{ margin: '2px', fontSize: '11px' }}
                    >
                        {desc}
                    </Button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // Media Query

        return (
            <React.Fragment>
                <div>
                    <AppBar>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h5">
                                Tic-Tac-Toe
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                    <Toolbar />
                </div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    style={{ minHeight: '100vh' }}
                >
                    <div className="game">
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                        </div>
                        <div className="game-info">
                            <div>
                                <Button
                                    variant="contained"
                                    startIcon={<StarIcon />}
                                >
                                    {status}
                                </Button>
                            </div>
                            <ol>{moves}</ol>
                        </div>
                    </div>
                </Grid>
            </React.Fragment>
        );
    }
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}