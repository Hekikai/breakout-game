(async function() {
	const {default: Ball} = await import('./classes/Ball.js');
	const {default: Block} = await import('./classes/Block.js');
	const {default: User} = await import('./classes/User.js');
	const {default: GameField} = await import('./classes/GameField.js');

	const ball = new Ball(230, 30);
	const user = new User(230, 10);
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
	];

	const gameField = new GameField(user, ball, blocks);
	gameField.renderScene();
})()