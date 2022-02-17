import Unit from "./Unit.js";
import Block from "./Block.js";
import GameField from "./GameField.js";

export default class User extends Unit {
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