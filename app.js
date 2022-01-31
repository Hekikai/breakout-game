const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('.score');
const scoreBlock = document.querySelector('.scoreBlock');
const boardWidth = parseInt(getComputedStyle(grid).width);
const boardHeight = parseInt(getComputedStyle(grid).height);
const blockWidth = 100;
const blockHeight = 20;

const userStart = [230, 10];
let [userOffsetLeft, userOffsetBottom] = userStart;

const ballStart = [230, 60];
let [ballOffsetLeft, ballOffsetBottom] = ballStart;

const ballDiameter = 20;
let xDirection = 2;
let yDirection = 2;
let score = 0;
let timerId = null;

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [blockWidth + xAxis, yAxis];
        this.topLeft = [xAxis, blockHeight + yAxis];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

const colors = ['#C1E1DC', '#FFCCAC', '#FFEB94', '#FDD475'];

const blocks = [
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
]

const addBlocks = () => {
    for (let index = 0; index < blocks.length; index++) {
        const block = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        block.classList.add('block');
        block.style.backgroundColor = color;
        changeLeftAndBottom(block, index);
        grid.append(block);
    }
}

const changeLeftAndBottom = (element, index) => {
    element.style.left = blocks[index].bottomLeft[0] + 'px';
    element.style.bottom = blocks[index].bottomLeft[1] + 'px';
}

const userInit = () => {
    const user = document.createElement('div');
    user.classList.add('user');
    drawUser(user);
    grid.append(user);
    return user;
}

const drawUser = (user) => {
    user.style.left = userOffsetLeft + 'px';
    user.style.bottom = userOffsetBottom + 'px';
}

const moveUser = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (userOffsetLeft > 0) {
                userOffsetLeft -= 10;
                drawUser(user);
            }
            break;
        case 'ArrowRight': {
            if (userOffsetLeft < boardWidth - blockWidth) {
                userOffsetLeft += 10;
                drawUser(user);
            }
            break;
        }
    }
}

const ballInit = () => {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.left = '230px';
    ball.style.bottom = '60px';
    grid.append(ball);
    return ball;
}

const drawBall = (ball) => {
    ball.style.left = ballOffsetLeft + 'px';
    ball.style.bottom = ballOffsetBottom + 'px';
}

const moveBall = () => {
    ballOffsetLeft += xDirection;
    ballOffsetBottom += yDirection;
    checkForCollisions();
    drawBall(ball);
}

const checkForCollisions = () => {
    // Check for block collisions
    for (let index = 0; index < blocks.length; index++) {
        if (
            (ballOffsetLeft > blocks[index].bottomLeft[0] &&
                ballOffsetLeft < blocks[index].bottomRight[0]) &&
            ((ballOffsetBottom + ballDiameter) > blocks[index].bottomLeft[1] &&
                ballOffsetBottom < blocks[index].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[index].classList.remove('block');
            blocks.splice(index, 1);
            changeDirectionBlocks();
            score++;
            scoreDisplay.textContent = String(score);

            if (blocks.length === 0) {
                scoreBlock.textContent = `You win! Your score is ${score}`;
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    // Check for user collision
    if (
        (ballOffsetLeft > userOffsetLeft && ballOffsetLeft < userOffsetLeft + blockWidth) &&
        (ballOffsetBottom > userOffsetBottom && ballOffsetBottom < userOffsetBottom + blockHeight)
    ) {
        changeDirectionUser();
    }

    // Check for wall collisions
    if (
        ballOffsetLeft >= (boardWidth - ballDiameter) ||
        ballOffsetBottom >= (boardHeight - ballDiameter) ||
        ballOffsetLeft <= 0) {
        changeDirectionWalls();
    }

    // Check for game over
    if (ballOffsetBottom <= 0) {
        clearInterval(timerId);
        scoreBlock.textContent = 'Game is over!';
        document.removeEventListener('keydown', moveUser);
    }
}

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

const user = userInit();
const ball = ballInit();
addBlocks();
drawBall(ball);
timerId = setInterval(moveBall, 20);

document.addEventListener('keydown', moveUser);

/*TODO: resolve issue with upper bound (ball's going top) => change function changeDirectionWalls;
* refactor code;
* style it better;
* do more general, not special
*/