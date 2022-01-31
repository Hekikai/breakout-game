const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('.score');
const scoreBlock = document.querySelector('.scoreBlock');

let xDirection = 2;
let yDirection = 2;
let score = 0;

class Object {
    constructor(offsetLeft, offsetBottom) {
        this.offsetLeft = offsetLeft;
        this.offsetBottom = offsetBottom;
    }
}

class Ball extends Object {
    constructor(offsetLeft, offsetBottom) {
        super(offsetLeft, offsetBottom);
        this.ball = document.createElement('div');
        this.ball.classList.add('ball');
        this.ball.style.left = this.offsetLeft + 'px';
        this.ball.style.bottom = this.offsetBottom + 'px';
        grid.append(this.ball);
    }

    static diameter = 20;

    draw() {
        this.ball.style.left = this.offsetLeft + 'px';
        this.ball.style.bottom = this.offsetBottom + 'px';
    }

    move() {
        this.offsetLeft += xDirection;
        this.offsetBottom += yDirection;
        this.draw();
    }
}

class User extends Object {
    constructor(offsetLeft, offsetBottom) {
        super(offsetLeft, offsetBottom);
        this.platform = document.createElement('div');
        this.platform.classList.add('user');
        this.draw();
        grid.append(this.platform);
    }

    move = (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (this.offsetLeft > 0) {
                    this.offsetLeft -= 10;
                    this.draw();
                }
                break;
            case 'ArrowRight': {
                if (this.offsetLeft < GameField.boardWidth - Block.blockWidth) {
                    this.offsetLeft += 10;
                    this.draw();
                }
                break;
            }
        }
    }

    draw = () => {
        this.platform.style.left = this.offsetLeft + 'px';
        this.platform.style.bottom = this.offsetBottom + 'px';
    }
}

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [Block.blockWidth + xAxis, yAxis];
        this.topLeft = [xAxis, Block.blockHeight + yAxis];
        this.topRight = [xAxis + Block.blockWidth, yAxis + Block.blockHeight];
        this.block = document.createElement('div');
        this.block.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        this.block.classList.add('block');
        this.block.style.left = this.bottomLeft[0] + 'px';
        this.block.style.bottom = this.bottomLeft[1] + 'px';
        grid.append(this.block);
    }

    static blockWidth = 100;
    static blockHeight = 20;
}

class GameField {
    constructor() {
        this.user = new User(230, 10);
        this.ball = new Ball(230, 60);
        this.blocks = [
            new Block(10, 270),
            // new Block(120, 270),
            // new Block(230, 270),
            // new Block(340, 270),
            // new Block(450, 270),
            // new Block(10, 240),
            // new Block(120, 240),
            // new Block(230, 240),
            // new Block(340, 240),
            // new Block(450, 240),
            // new Block(10, 210),
            // new Block(120, 210),
            // new Block(230, 210),
            // new Block(340, 210),
            // new Block(450, 210),
        ];
        document.addEventListener('keydown', this.user.move);
        this.timerId = setInterval(this.renderScene, 20);
    }

    static boardWidth = parseInt(getComputedStyle(grid).width);
    static boardHeight = parseInt(getComputedStyle(grid).height);

    renderScene = () => {
        this.ball.move();
        this.checkForCollision();
    }

    checkForCollision() {
        // Check for block collisions
        for (let index = 0; index < this.blocks.length; index++) {
            if (
                (this.ball.offsetLeft > this.blocks[index].bottomLeft[0] &&
                    this.ball.offsetLeft < this.blocks[index].bottomRight[0]) &&
                ((this.ball.offsetBottom + Ball.diameter) > this.blocks[index].bottomLeft[1] &&
                    this.ball.offsetBottom < this.blocks[index].topLeft[1])
            ) {
                const allBlocks = Array.from(document.querySelectorAll('.block'));
                allBlocks[index].classList.remove('block');
                this.blocks.splice(index, 1);
                changeDirectionBlocks();
                score++;
                scoreDisplay.textContent = String(score);

                if (this.blocks.length === 0) {
                    scoreBlock.textContent = `You win! Your score is ${score}`;
                    clearInterval(this.timerId);
                    document.removeEventListener('keydown', this.user.move);
                }
            }
        }

        // Check for user collision
        if (
            (this.ball.offsetLeft > this.user.offsetLeft && this.ball.offsetLeft < this.user.offsetLeft + Block.blockWidth) &&
            (this.ball.offsetBottom > this.user.offsetBottom && this.ball.offsetBottom < this.user.offsetBottom + Block.blockHeight)
        ) {
            changeDirectionUser();
        }

        // Check for wall collisions
        if (
            this.ball.offsetLeft >= (GameField.boardWidth - Ball.diameter) ||
            this.ball.offsetBottom >= (GameField.boardHeight - Ball.diameter) ||
            this.ball.offsetLeft <= 0) {
            changeDirectionWalls();
        }

        // Check for game over
        if (this.ball.offsetBottom <= 0) {
            clearInterval(this.timerId);
            scoreBlock.textContent = 'Game is over!';
            document.removeEventListener('keydown', this.user.move);
        }
    }
}

const colors = ['#C1E1DC', '#FFCCAC', '#FFEB94', '#FDD475'];

const changeDirectionWalls = () => {
    if (xDirection === 2 && yDirection === 2) {
        xDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        xDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}

const changeDirectionBlocks = () => {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
}

const changeDirectionUser = () => {
    if (xDirection === 2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
}
const gameField = new GameField();
gameField.renderScene();

