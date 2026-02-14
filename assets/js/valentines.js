document.addEventListener('DOMContentLoaded', function() {
    const GRID_SIZE = 10;
    const WIN_SCORE = 10;
    const HEART_IMAGE = 'assets/img/valentines/heart.png';

    const gameGrid = document.getElementById('gameGrid');
    const header = document.getElementById('header');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const gameOverScore = document.getElementById('gameOverScore');
    const playAgainButton = document.getElementById('playAgainButton');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupHeader = document.getElementById('popupHeader');
    const popupImage = document.getElementById('popupImage');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const popupCloseButton = document.getElementById('popupCloseButton');

    let cells = [];
    let snake = [];
    let food = null;
    let direction = null;
    let nextDirection = null;
    let score = 0;
    let gameLoop = null;
    let gameOver = false;

    function createGrid() {
        gameGrid.innerHTML = '';
        cells = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameGrid.appendChild(cell);
                cells.push(cell);
            }
        }
    }

    function getCell(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    function initGame() {
        gameOver = false;
        score = 0;
        snake = [{ row: Math.floor(GRID_SIZE / 2), col: Math.floor(GRID_SIZE / 2) }];
        direction = null;
        nextDirection = null;

        createGrid();
        clearSnakeAndFood();
        addSnakeToGrid();
        spawnFood();
        updateScore();

        header.textContent = 'get the hearts to win!';
        header.classList.remove('text-green-600');
        header.classList.add('text-pink-500');

        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(tick, 200);
    }

    function clearSnakeAndFood() {
        cells.forEach(cell => {
            cell.classList.remove('snake-cell');
            cell.classList.remove('food-cell');
            cell.innerHTML = '';
        });
    }

    function addSnakeToGrid() {
        snake.forEach((pos, i) => {
            const cell = getCell(pos.row, pos.col);
            if (cell) {
                cell.classList.add('snake-cell');
            }
        });
    }

    function spawnFood() {
        const emptyCells = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const isSnake = snake.some(s => s.row === row && s.col === col);
                if (!isSnake) emptyCells.push({ row, col });
            }
        }
        if (emptyCells.length === 0) return;
        food = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        const foodCell = getCell(food.row, food.col);
        foodCell.classList.add('food-cell');
        const img = document.createElement('img');
        img.src = HEART_IMAGE;
        img.alt = 'heart';
        foodCell.appendChild(img);
    }

    function updateScore() {
        scoreDisplay.textContent = `Hearts: ${score} / ${WIN_SCORE}`;
    }

    function tick() {
        if (gameOver) return;

        if (direction === null) return;

        nextDirection = nextDirection || direction;
        direction = nextDirection;

        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.row--; break;
            case 'down': head.row++; break;
            case 'left': head.col--; break;
            case 'right': head.col++; break;
        }

        if (head.row < 0 || head.row >= GRID_SIZE || head.col < 0 || head.col >= GRID_SIZE) {
            endGame(false);
            return;
        }

        if (snake.some(s => s.row === head.row && s.col === head.col)) {
            endGame(false);
            return;
        }

        snake.unshift(head);

        if (food && head.row === food.row && head.col === food.col) {
            score++;
            updateScore();
            food = null;
            clearSnakeAndFood();
            addSnakeToGrid();
            spawnFood();

            if (score >= WIN_SCORE) {
                endGame(true);
                return;
            }
        } else {
            snake.pop();
        }

        clearSnakeAndFood();
        addSnakeToGrid();
        if (food) {
            const foodCell = getCell(food.row, food.col);
            foodCell.classList.add('food-cell');
            const img = document.createElement('img');
            img.src = HEART_IMAGE;
            img.alt = 'heart';
            foodCell.appendChild(img);
        }
    }

    function endGame(won) {
        gameOver = true;
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = null;
        }

        if (won) {
            popupHeader.textContent = 'will you be my valentine?';
            popupImage.src = 'assets/img/valentines/initial.png';
            popupOverlay.classList.add('visible');
        } else {
            gameOverScore.textContent = `Score: ${score}`;
            gameOverOverlay.classList.add('visible');
        }
    }

    function showWinScreen() {
        popupHeader.textContent = 'yay!! happy valentine\'s day!';
        popupImage.src = 'assets/img/valentines/yes.gif';
        yesButton.style.display = 'none';
        noButton.style.display = 'none';
        popupCloseButton.classList.remove('hidden');
    }

    function resetPopupAndGame() {
        popupOverlay.classList.remove('visible');
        popupCloseButton.classList.add('hidden');
        yesButton.style.display = '';
        noButton.style.display = '';
        popupHeader.textContent = 'will you be my valentine?';
        popupImage.src = 'assets/img/valentines/initial.png';
        initGame();
        header.textContent = 'eat the hearts to win!';
    }

    document.addEventListener('keydown', function(e) {
        if (gameOver) return;

        const canReverse = snake.length === 1;
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (canReverse || direction !== 'down') nextDirection = 'up';
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (canReverse || direction !== 'up') nextDirection = 'down';
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (canReverse || direction !== 'right') nextDirection = 'left';
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (canReverse || direction !== 'left') nextDirection = 'right';
                e.preventDefault();
                break;
        }

        if (direction === null && nextDirection !== null) {
            direction = nextDirection;
        }
    });

    yesButton.addEventListener('click', function() {
        showWinScreen();
    });

    noButton.addEventListener('click', function() {
        popupOverlay.classList.remove('visible');
        popupCloseButton.classList.add('hidden');
        yesButton.style.display = '';
        noButton.style.display = '';
        popupHeader.textContent = 'will you be my valentine?';
        popupImage.src = 'assets/img/valentines/initial.png';
        initGame();
        header.textContent = 'you don\'t love me ☹️ play again...';
    });

    popupCloseButton.addEventListener('click', resetPopupAndGame);

    playAgainButton.addEventListener('click', function() {
        gameOverOverlay.classList.remove('visible');
        initGame();
    });

    initGame();
});
