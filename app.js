class GameField {
    constructor() {
        this.user = new User(230, 10);
        this.ball = new Ball(230, 30);
        this.blocks = [
            new Block(10, 270),
            new Block(120, 270),
            new Block(230, 270),
            new Block(340, 270),
            new Block(450, 270),
            new Block(10, 240),
            new Block(120, 240),
            new Block(230, 240),
            new Block(340, 240),
            new Block(450, 240),
            new Block(10, 210),
            new Block(120, 210),
            new Block(230, 210),
            new Block(340, 210),
            new Block(450, 210),
        ];
        document.addEventListener('keydown', this.user.move);
        this.timerId = setInterval(this.renderScene, 20);
    }

    static grid = document.querySelector('.grid');
    static scoreDisplay = document.querySelector('.score');
    static scoreBlock = document.querySelector('.scoreBlock');
    static score = 0;
    static boardWidth = parseInt(getComputedStyle(GameField.grid).width);
    static boardHeight = parseInt(getComputedStyle(GameField.grid).height);
    static colors = ['#C1E1DC', '#FFCCAC', '#FFEB94', '#FDD475'];

    renderScene = () => {
        this.ball.move();
        this.checkForCollision();
    }

    checkForCollision = () => {
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
                this.changeDirectionBlocks();
                GameField.scoreDisplay.textContent = String(++GameField.score);

                if (this.blocks.length === 0) {
                    this.finishGame(`You win! Your score is ${GameField.score}`);
                }
            }
        }

        // Check for user collision
        if (
            (this.ball.offsetLeft > this.user.offsetLeft && this.ball.offsetLeft < this.user.offsetLeft + Block.blockWidth) &&
            (this.ball.offsetBottom > this.user.offsetBottom && this.ball.offsetBottom < this.user.offsetBottom + Block.blockHeight)
        ) {
            this.changeDirectionUser();
        }

        // Check for wall collisions
        if (
            this.ball.offsetLeft >= (GameField.boardWidth - Ball.diameter) ||
            this.ball.offsetBottom >= (GameField.boardHeight - Ball.diameter) ||
            this.ball.offsetLeft <= 0) {
            this.changeDirectionWalls();
        }

        // Check for game over
        if (this.ball.offsetBottom <= 0) {
            this.finishGame('Game is over!');
        }
    }

    changeDirectionWalls = () => {
        if (this.ball.moveDirection.x > 0 && this.ball.moveDirection.y > 0) {
            this.ball.moveDirection.x = -this.ball.moveDirection.x;
            return;
        }
        if (this.ball.moveDirection.x > 0 && this.ball.moveDirection.y < 0) {
            this.ball.moveDirection.x = -this.ball.moveDirection.x;
            return;
        }
        if (this.ball.moveDirection.x < 0 && this.ball.moveDirection.y < 0) {
            this.ball.moveDirection.x = -this.ball.moveDirection.x;
            return;
        }
        if (this.ball.moveDirection.x < 0 && this.ball.moveDirection.y > 0) {
            this.ball.moveDirection.x = -this.ball.moveDirection.x;
            return;
        }
    }

    changeDirectionBlocks = () => {
        if (this.ball.moveDirection.x > 0 && this.ball.moveDirection.y > 0) {
            this.ball.moveDirection.y = -this.ball.moveDirection.y;
            return;
        }
        if (this.ball.moveDirection.x < 0 && this.ball.moveDirection.y > 0) {
            this.ball.moveDirection.y = -this.ball.moveDirection.y;
            return;
        }
    }

    changeDirectionUser = () => {
        if (this.ball.moveDirection.x > 0 && this.ball.moveDirection.y < 0) {
            this.ball.moveDirection.y = -this.ball.moveDirection.y;
            return;
        }
        if (this.ball.moveDirection.x < 0 && this.ball.moveDirection.y < 0) {
            this.ball.moveDirection.y = -this.ball.moveDirection.y;
            return;
        }
    }

    finishGame = (text) => {
        clearInterval(this.timerId);
        GameField.scoreBlock.textContent = text;
        document.removeEventListener('keydown', this.user.move);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Unit {
    constructor(offsetLeft, offsetBottom, styledClass) {
        this.offsetLeft = offsetLeft;
        this.offsetBottom = offsetBottom;
        // this.bottomLeft = new Point(offsetLeft, offsetBottom);
        this.element = document.createElement('div');
        this.element.classList.add(styledClass);
        this.redraw();
        GameField.grid.append(this.element);
    }

    redraw = () => {
        this.element.style.left = this.offsetLeft + 'px';
        this.element.style.bottom = this.offsetBottom + 'px';
    }
}

class Ball extends Unit {
    constructor(offsetLeft, offsetBottom) {
        super(offsetLeft, offsetBottom, 'ball');
        this.moveDirection = new Vector(3, 3);
    }

    static diameter = 20;

    move = () => {
        this.offsetLeft += this.moveDirection.x;
        this.offsetBottom += this.moveDirection.y;
        this.redraw();
    }
}

class User extends Unit {
    constructor(offsetLeft, offsetBottom) {
        super(offsetLeft, offsetBottom, 'user');
    }

    move = (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (this.offsetLeft > 0) {
                    this.offsetLeft -= 10;
                    this.redraw();
                }
                break;
            case 'ArrowRight': {
                if (this.offsetLeft < GameField.boardWidth - Block.blockWidth) {
                    this.offsetLeft += 10;
                    this.redraw();
                }
                break;
            }
        }
    }
}

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [Block.blockWidth + xAxis, yAxis];
        this.topLeft = [xAxis, Block.blockHeight + yAxis];
        this.topRight = [xAxis + Block.blockWidth, yAxis + Block.blockHeight];
        this.block = document.createElement('div');
        this.block.style.backgroundColor = GameField.colors[Math.floor(Math.random() * GameField.colors.length)];
        this.block.classList.add('block');
        this.block.style.left = this.bottomLeft[0] + 'px';
        this.block.style.bottom = this.bottomLeft[1] + 'px';
        GameField.grid.append(this.block);
    }

    static blockWidth = 100;
    static blockHeight = 20;
}

const gameField = new GameField();
gameField.renderScene();
/*TODO: разобраться с коллизией с блоками (дописать условия)
 * разобраться с верхней стенкой (поменять проверку с offsetBottom)
 * енум для кнопок со сложностью
 * динамическая генерация блоков
*/
// class Block extends Unit