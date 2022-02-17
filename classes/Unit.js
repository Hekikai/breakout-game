import GameField from "./GameField.js";

export default class Unit {
	constructor(offsetLeft, offsetBottom, styledClass) {
		this.offsetLeft = offsetLeft;
		this.offsetBottom = offsetBottom;
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