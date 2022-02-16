import GameField from "./GameField.js";

export default class Block {
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