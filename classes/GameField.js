import Block from "./Block.js";
import Ball from "./Ball.js";

export default class GameField {
	constructor(user, ball, blocks) {
		this.user = user;
		this.ball = ball;
		this.blocks = [...blocks];
		document.addEventListener('keydown', this.resetGame);
		document.addEventListener('keydown', this.user.move);
		this.timerId = setInterval(this.renderScene, 20);
	}

	static grid = document.querySelector('.grid');
	static scoreDisplay = document.querySelector('.score');
	static scoreBlock = document.querySelector('.score-block');
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
					this.finishGame(`You win! Your score is ${ GameField.score }`);
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

		// Check for side walls collision
		if (
			this.ball.offsetLeft >= (GameField.boardWidth - Ball.diameter) ||
			this.ball.offsetLeft <= 0) {
			this.changeDirectionSideWalls();
		}

		// Check for upper wall collision
		if (this.ball.offsetBottom >= (GameField.boardHeight - Ball.diameter)) {
			this.changeDirectionUpperWall();
		}

		// Check for game over
		if (this.ball.offsetBottom <= 0) {
			this.finishGame('Game is over! Press "Space" to reset game!');
		}
	}

	changeDirectionUpperWall = () => {
		if (this.ball.moveDirection.x > 0 && this.ball.moveDirection.y > 0) {
			this.ball.moveDirection.y = -this.ball.moveDirection.y;
		}

		if (this.ball.moveDirection.x < 0 && this.ball.moveDirection.y > 0) {
			this.ball.moveDirection.y = -this.ball.moveDirection.y;
		}
	}

	changeDirectionSideWalls = () => {
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

	resetGame = (e) => {
		if (e.code === "Space") {
			clearInterval(this.timerId);
			this.ball.element.remove();
			this.user.element.remove();

			this.ball = new Ball(230, 30);
			this.timerId = setInterval(this.renderScene, 20);
			document.addEventListener('keydown', this.user.move);
		}
	}


	finishGame = (text) => {
		clearInterval(this.timerId);
		GameField.scoreBlock.textContent = text;
		document.removeEventListener('keydown', this.user.move);
	}

}