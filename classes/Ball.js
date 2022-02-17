import Unit from "./Unit.js";
import Vector from "./Vector.js";

export default class Ball extends Unit {
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