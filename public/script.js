let board = [];
let N = 8;
let timerInterval;
let startTime;
let score = 0;
let gameStarted = false;
let highScore = { score: 0, boardSize: 0 };

document.addEventListener('DOMContentLoaded', function() {
    loadHighScore();
    initBoard(); // Initialize the board when the page loads
});

function loadHighScore() {
    const savedHighScore = JSON.parse(localStorage.getItem('nQueensHighScore')) || { score: 0, boardSize: 0 };
    highScore = savedHighScore;
    updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
    const highScoreElement = document.getElementById('highScore');
    if (highScore.score > 0) {
        highScoreElement.textContent = `Highest Score: ${highScore.boardSize}x${highScore.boardSize} board : ${highScore.score.toFixed(2)}`;
    } else {
        highScoreElement.textContent = 'Highest Score: None';
    }
}

function initBoard() {
    N = parseInt(document.getElementById("boardSize").value);
    const chessboard = document.getElementById("chessboard");
    chessboard.innerHTML = '';
    chessboard.style.gridTemplateColumns = `repeat(${N}, 47px)`;
    
    board = Array.from({ length: N }, () => Array(N).fill(''));
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            cell.id = `cell-${i}-${j}`;
            cell.addEventListener('click', () => placeMarker(i, j));
            chessboard.appendChild(cell);
        }
    }

    resetTimer();
    gameStarted = false;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        resetTimer();
        startTimer();
    }
}

function placeMarker(row, col) {
    if (!gameStarted) return;
    
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell.textContent === '') {
        cell.textContent = 'Q';
        board[row][col] = 'Q';
    } else {
        cell.textContent = '';
        board[row][col] = '';
    }
}

function verifyBoard() {
    if (!gameStarted) {
        alert("Please start the game first!");
        return;
    }

    stopTimer();
    if (isValidBoard()) {
        calculateScore();
        updateHighScore();
        alert(`Correct solution! Your score: ${score.toFixed(2)}`);
    } else {
        score = -1;
        document.getElementById('score').textContent = `Score: ${score}`;
        alert('Incorrect solution. Conflicting queens are highlighted in red.');
        highlightConflicts();
    }
    gameStarted = false;
}

function isValidBoard() {
    const rows = new Set();
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    let queensCount = 0;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (board[i][j] === 'Q') {
                queensCount++;
                if (rows.has(i) || cols.has(j) || diag1.has(i - j) || diag2.has(i + j)) {
                    return false;
                }
                rows.add(i);
                cols.add(j);
                diag1.add(i - j);
                diag2.add(i + j);
            }
        }
    }
    
    return queensCount === N;
}

function highlightConflicts() {
    const rows = new Set();
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    const conflicts = new Set();

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (board[i][j] === 'Q') {
                if (rows.has(i) || cols.has(j) || diag1.has(i - j) || diag2.has(i + j)) {
                    conflicts.add(`${i},${j}`);
                }
                rows.add(i);
                cols.add(j);
                diag1.add(i - j);
                diag2.add(i + j);
            }
        }
    }

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (conflicts.has(`${i},${j}`)) {
                cell.classList.add('conflict');
            } else {
                cell.classList.remove('conflict');
            }
        }
    }
}

function resetBoard() {
    board = Array.from({ length: N }, () => Array(N).fill(''));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            cell.textContent = '';
            cell.classList.remove('conflict');
        }
    }
    resetTimer();
    gameStarted = false;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    document.getElementById('timer').textContent = 'Time: 0s';
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Time: ${elapsedTime}s`;
}

function calculateScore() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    score = (1 / elapsedTime) * 100;
    document.getElementById('score').textContent = `Score: ${score.toFixed(2)}`;
}

function updateHighScore() {
    if (score > highScore.score || (score === highScore.score && N > highScore.boardSize)) {
        highScore = { score: score, boardSize: N };
        localStorage.setItem('nQueensHighScore', JSON.stringify(highScore));
        updateHighScoreDisplay();
    }
}

function resetHighScore() {
    highScore = { score: 0, boardSize: 0 };
    localStorage.removeItem('nQueensHighScore');
    updateHighScoreDisplay();
}