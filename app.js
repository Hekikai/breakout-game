const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('.score');
const scoreBlock = document.querySelector('.scoreBlock');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;

const userStart = [230, 10];
let [currentLeft, currentBottom] = userStart;

const ballStart = [230, 30];
let [ballCurrentLeft, ballCurrentBottom] = ballStart;

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
        block.classList.add('block');
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
    user.style.left = currentLeft + 'px';
    user.style.bottom = currentBottom + 'px';
}

const moveUser = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentLeft > 0) {
                currentLeft -= 10;
                drawUser(user);
            }
            break;
        case 'ArrowRight': {
            if (currentLeft < boardWidth - blockWidth) {
                currentLeft += 10;
                drawUser(user);
            }
            break;
        }
    }
}

const ballInit = () => {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    grid.append(ball);
    return ball;
}

const drawBall = (ball) => {
    ball.style.left = ballCurrentLeft + 'px';
    ball.style.bottom = ballCurrentBottom + 'px';
    checkForCollisions();
}

const checkForCollisions = () => {
    //check for block collisions
    for (let index = 0; index < blocks.length; index++) {
        if (
            (ballCurrentLeft > blocks[index].bottomLeft[0] &&
                ballCurrentLeft < blocks[index].bottomRight[0]) &&
            ((ballCurrentBottom + ballDiameter) > blocks[index].bottomLeft[1] &&
                ballCurrentBottom < blocks[index].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[index].classList.remove('block');
            blocks.splice(index, 1);
            changeDirection();
            score++;
            scoreDisplay.textContent = score;

            if (blocks.length === 0) {
                scoreBlock.textContent = `You win! Your score is ${score}`;
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    //check for user collision
    if (
        (ballCurrentLeft > currentLeft && ballCurrentLeft < currentLeft + blockWidth) &&
        (ballCurrentBottom > currentBottom && ballCurrentBottom < currentBottom + blockHeight)
    ) {
        changeDirection();
    }

    //check for wall collisions
    if (
        ballCurrentLeft >= (boardWidth - ballDiameter) ||
        ballCurrentBottom >= (boardHeight - ballDiameter) ||
        ballCurrentLeft <= 0) {
        changeDirection();
    }

    //check for game over
    if (ballCurrentBottom <= 0) {
        clearInterval(timerId);
        scoreBlock.textContent = 'Game is over!';
        document.removeEventListener('keydown', moveUser);
    }
}

const moveBall = () => {
    drawBall(ball);
    ballCurrentLeft += xDirection;
    ballCurrentBottom += yDirection;
}

const changeDirection = () => {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }

}

timerId = setInterval(moveBall, 30);
const user = userInit();
const ball = ballInit();
drawBall(ball);
addBlocks();

document.addEventListener('keydown', moveUser);
/*TODO: resolve an issue with direction movement;
    refactor code and make it more clean;
 */